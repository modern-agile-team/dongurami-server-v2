# Branch Strategy

**지라 이슈를 먼저 생성 후 작업타입, 티켓번호로 브랜치를 생성한다.**

### 작업 타입

|   Type   |     Description     |         Example         |
| :------: | :-----------------: | :---------------------: |
|  deploy  |   배포 관련 작업    |       배포 자동화       |
|   auto   |     자동화 작업     |     swagger 자동화      |
|  setup   |   세팅 관련 작업    |      typeorm setup      |
|   doc    |      문서 작업      |       README 수정       |
|    db    |     DB관련 작업     |        migration        |
|   fix    |   버그 수정 작업    |      500에러 수정       |
|   feat   |      기능 추가      |    로그인 기능 추가     |
|  modify  |   기능 수정 작업    |    로그인 기능 수정     |
| refactor |    단순 리펙토링    |      prettier 적용      |
|  delete  | 단순 코드 삭제 작업 | 사용하지 않는 코드 삭제 |
|   test   |   테스트코드 작업   | 로그인 테스트코드 추가  |

### Branch Example

지라이슈 생성 후 타입과 티켓번호로 브랜치 생성

**auto/QYOG-54**

<img width="832" alt="image" src="https://github.com/modern-agile-team/dongurami-server-v2/assets/46591459/897f8bc0-2111-4cbc-8f8b-3bb7430db43b">
