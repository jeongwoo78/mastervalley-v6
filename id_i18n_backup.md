# Master Valley i18n 교육 콘텐츠 번역 백업
## 2026-02-28 인도네시아어(id) 완료 시점

---

## 전체 진행 현황

| 언어 | 상태 | 파일 수 | 비고 |
|------|------|---------|------|
| 🇰🇷 ko | ✅ 완료 | 10 | 원본 |
| 🇺🇸 en | ✅ 완료 | 10 | 원본 |
| 🇯🇵 ja | ✅ 완료 | 6교육+4스텁 | 2,467행 · ja_education.zip |
| 🇪🇸 es | ✅ 완료 | 6교육 | 2,547행 · es_education.zip |
| 🇫🇷 fr | ✅ 완료 | 6교육 | 2,515행 · fr_education.zip |
| 🇮🇩 id | ✅ 완료 | 6교육 | 742행(compact) · id_education.zip |
| 🇧🇷 pt | ⬜ 미완 | 0/6 | BR포르투갈어 |
| 🇸🇦 ar | ⬜ 미완 | 0/6 | RTL, 성별동사 주의 |
| 🇹🇷 tr | ⬜ 미완 | 0/6 | 격식체 |

**남은 작업: 3개 언어 × 6파일 = 18파일**

---

## 교육 콘텐츠 6파일 구조

각 언어별 동일 구조:

| 파일명 | 내용 | 키 구조 |
|--------|------|---------|
| movements.js | 11개 미술운동 + 45개 작가/양식 | movementsBasicInfo + movementsLoadingEducation(11) + movementsResultEducation(45) |
| masters.js | 8명 거장 + 24개 작품 | mastersBasicInfo + mastersLoadingEducation(8) + mastersResultEducation(24+8default) |
| oriental.js | 3개국 + 7개 장르 | orientalBasicInfo + orientalLoadingEducation(3) + orientalResultEducation(7+3default) |
| oneclickMovements.js | 원클릭 미술운동 | oneclickMovementsPrimary + oneclickMovementsBasicInfo(40) + oneclickMovementsSecondary(40) |
| oneclickMasters.js | 원클릭 거장 | oneclickMastersPrimary + oneclickMastersBasicInfo(8) + oneclickMastersSecondary(8) |
| oneclickOriental.js | 원클릭 동양화 | oneclickOrientalPrimary + oneclickOrientalBasicInfo(7) + oneclickOrientalSecondary(7) |

---

## 텍스트 구조 규칙

### Loading 교육 (1차 · 미술운동/거장 소개)
- 5줄 = 3줄 + 빈줄 + 2줄
- masters: 과거 시제 (역사적 서술)

### Result 교육 (2차 · 개별 작가/작품)
- 4줄 = 2줄 + 빈줄 + 2줄
- "~의 기법이 적용되었습니다" 형식 (현재 시제)

### Oneclick Primary (로딩 화면)
- 시적 톤, 자유 형식

### Oneclick Secondary (결과 화면)
- 2문단: 운동/국가 정의(고정) → 작가/장르 소개(가변)

---

## 번역 원칙 (언어별)

| 언어 | 핵심 원칙 |
|------|-----------|
| 🇯🇵 ja | 敬体(です/ます), 일본식 한자 표기 |
| 🇪🇸 es | 미술용어 스페인어화, Frida 원어 인용 |
| 🇫🇷 fr | sfumato/ténébrisme/clair-obscur 원어 자연 사용, Le Caravage 등 프랑스식 화가명 |
| 🇮🇩 id | 격식체(formal register), 미술용어 국제표준 유지 |
| 🇧🇷 pt | 브라질 포르투갈어(BR), você 사용 |
| 🇸🇦 ar | RTL, 성별 동사 일치, 미술용어 아랍어 표준 |
| 🇹🇷 tr | 격식체(siz), 터키어 미술용어 표준 |

---

## 소스 파일 위치

```
/home/claude/work/src/i18n/
├── ko/    ← 한국어 원본 (10파일)
├── en/    ← 영어 원본 (10파일)
├── ja/    ← 일본어 완료 (10파일)
├── es/    ← 스페인어 완료 (6교육파일)
├── fr/    ← 프랑스어 완료 (6교육파일)
├── id/    ← 인도네시아어 완료 (6교육파일 + 스텁)
├── pt/    ← 미완 (스텁만)
├── ar/    ← 미완 (스텁만)
└── tr/    ← 미완 (스텁만)
```

---

## 작업 방식

1. ko 원본 구조를 기준으로 번역 (en 참고)
2. 파일 생성 → 키 수 검증 (subtitle1, description/content 카운트) → zip 압축 → 전달
3. 기존 스텁 파일(3행짜리) 있으면 rm 후 새로 생성
4. compact 형식(한줄 키) 또는 multi-line 형식 모두 허용 — 키 수만 일치하면 OK

## id 파일 참고 (compact 형식)

id는 movements.js의 result BasicInfo를 한줄 compact로 작성.
masters.js도 BasicInfo/LoadingEducation/ResultEducation 모두 compact.
이 형식이 행수는 적지만 키 수/콘텐츠 완전 동일.

키 수 기준:
- movements: subtitle1 = 51 (11 loading + 40 result)
- masters: subtitle1 = 32 (8 loading + 24 result), description = 40 (8 loading + 24 result + 8 default)
- oriental: subtitle1 = 10, description = 13 (3 loading + 7 result + 3 default)
- oneclickMovements: subtitle1 = 40, content = 41 (1 primary + 40 secondary)
- oneclickMasters: subtitle1 = 8, content = 9 (1 primary + 8 secondary)
- oneclickOriental: subtitle1 = 7, content = 8 (1 primary + 7 secondary)

---

## 다음 작업 순서 (권장)

1. **pt (포르투갈어-BR)** — 로망스어 계열, es/fr 참고 가능
2. **tr (터키어)** — 교착어, 독립 작업
3. **ar (아랍어)** — RTL + 성별 동사, 가장 복잡

---

## 전사 기록

- `/mnt/transcripts/2026-02-28-06-47-36-ja-i18n-oneclick-completion.txt` (ja 완료)
- `/mnt/transcripts/2026-02-28-07-51-54-es-i18n-education-completion.txt` (es 완료 + fr/id 포함)
