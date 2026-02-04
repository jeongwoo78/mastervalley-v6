=========================================
Master Valley v77 - 교육 콘텐츠 i18n 완료
=========================================

📅 날짜: 2026-02-05

=========================================
변경 사항
=========================================

1. 교육 콘텐츠 i18n 구조 통합
   - data/ 폴더의 이전 교육 파일들 삭제
   - i18n/ko/, i18n/en/에서 모든 교육 콘텐츠 관리
   
2. 삭제된 파일 (data/)
   - mastersEducation.js
   - movementsEducation.js
   - orientalEducation.js
   - oneclickMastersEducation.js
   - oneclickMovementsEducation.js
   - oneclickOrientalEducation.js

3. 수정된 파일
   - i18n/index.js - 원클릭 getter 추가
   - ResultScreen.jsx - i18n에서 교육 데이터 로드
   - ProcessingScreen.jsx - i18n에서 교육 데이터 로드
   - educationContent.js - i18n 래퍼로 재작성

=========================================
적용 방법
=========================================

기존 mastervalley-v6 폴더에서:

1. src/ 폴더 전체 덮어쓰기
2. api/ 폴더 전체 덮어쓰기
3. package.json 덮어쓰기

4. 터미널에서:
   cd mastervalley-v6
   npm install
   npm run build

=========================================
