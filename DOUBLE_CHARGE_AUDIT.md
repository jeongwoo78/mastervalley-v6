# 이중 차감 전수 감사 (Double-Charge Audit)

## 현재 상태

크레딧 차감 시스템이 **미구현**입니다:
```javascript
// App.jsx
const [userCredits, setUserCredits] = useState(2.50);  // 하드코딩 초기값
setUserCredits(prev => prev + pack.value);              // 충전만 있음
// 차감 로직 = 없음
```

지금이 **안전하게 설계할 최적의 시점**입니다.

---

## 이중 실행 시나리오 전수 검사

### ✅ 해결된 시나리오

| # | 시나리오 | 위험도 | 방어 장치 |
|---|---|---|---|
| 1 | **StrictMode 이중 마운트** | 🔴 높음 | `startedRef` (ProcessingScreen) |
| 2 | **Vercel 60초 타임아웃 → 재시도** | 🔴 높음 | predictionId 즉시 반환 (v79) |
| 3 | **Kontext 타임아웃** | 🟡 중간 | predictionId 즉시 반환 (v80) |
| 4 | **Modify 버튼 이중 탭** | 🟡 중간 | `retransformingMasters[key]` guard |
| 5 | **Retry 버튼 이중 탭** | 🟡 중간 | `isRetrying` guard |
| 6 | **백그라운드 복귀 후 폴링 중단** | 🟡 중간 | `smartSleep` + `visibilitychange` |
| 7 | **폴링 중 네트워크 에러** | 🟢 낮음 | catch → continue (새 prediction 안 만듦) |

### ⚠️ 남은 리스크

| # | 시나리오 | 설명 | 영향 |
|---|---|---|---|
| 8 | **초기 POST 네트워크 끊김** | 서버가 prediction 생성 후 응답이 클라이언트에 안 도착 → 클라이언트 재시도 → prediction 2개 생성 | Replicate 비용 2배 (우리 손해) |
| 9 | **크레딧 차감 미구현** | 성공 후 차감 로직 자체가 없음 | 🔴 출시 전 필수 구현 |

---

## 안전한 크레딧 차감 설계

### 핵심 원칙
1. **성공 후 차감** — API 실패 시 환불 걱정 없음
2. **멱등성(Idempotency)** — 같은 변환에 대해 절대 2번 차감 안 함
3. **서버 검증** — 클라이언트 조작 불가

### 구현 방안

```
[클라이언트]                    [서버]                      [Firebase]
    │                            │                            │
    ├── transformId = uuid() ──→ │                            │
    │                            ├── Replicate prediction ──→ │
    │                            │                            │
    │ ←── predictionId 반환 ──── │                            │
    │                            │                            │
    ├── 폴링 (check-prediction)  │                            │
    │        ...                 │                            │
    │ ←── status: succeeded ──── │                            │
    │                            │                            │
    ├── POST /api/deduct-credit  │                            │
    │   { transformId, cost }    │                            │
    │                            ├── Firestore Transaction ─→ │
    │                            │   1. transformId 중복 체크  │
    │                            │   2. 잔액 >= cost 확인     │
    │                            │   3. 잔액 차감             │
    │                            │   4. transformId 기록      │
    │                            │                            │
    │ ←── { success, balance } ── │                            │
```

### 시나리오 8 해결: 멱등성 키

```javascript
// 클라이언트 - processStyleTransfer 호출 전
const transformId = crypto.randomUUID();

// 서버 - /api/deduct-credit
const docRef = db.collection('transactions').doc(transformId);
await db.runTransaction(async (t) => {
  const existing = await t.get(docRef);
  if (existing.exists) return; // 이미 차감됨 → 무시 (멱등성)
  
  const userDoc = await t.get(userRef);
  const balance = userDoc.data().credits;
  if (balance < cost) throw new Error('Insufficient balance');
  
  t.update(userRef, { credits: balance - cost });
  t.set(docRef, { userId, cost, timestamp: new Date() });
});
```

### 차감 시점별 비교

| 시점 | 장점 | 단점 |
|---|---|---|
| API 호출 전 | 무료 사용 방지 | 실패 시 환불 필요 (복잡) |
| **성공 후 (권장)** | 실패=무과금 (단순) | 극히 드문 무료 사용 가능 |
| 서버에서 prediction 생성 시 | 정확한 타이밍 | 실패 시 환불 필요 |
