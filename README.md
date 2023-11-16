# **Dongurami Server V2**

#### 인덕대학교 학생들을 위한 동아리 서비스

---

## Branch Strategy

**이슈 생성 시 이슈 번호, 이슈 라벨, 이슈 제목을 기준으로 자동 생성된 브랜치를 사용하는걸 원칙으로 한다.**

**이슈 생성 시 `Assignees`, `Labels`, `Project` 를 꼭 설정해주세요**

### Default Branch

| Name | Description                    |
| ---- | ------------------------------ |
| main | repository default branch      |
| dev  | development environment branch |

### Branch Example

Issue 생성 시 action bot 이 아래처럼 comment 를 남깁니다.

![image](https://github.com/modern-agile-team/dongurami-server-v2/assets/46591459/654a7268-d4b8-477b-b32a-d252d9ae03bf)

- {Label}/#{issue-number}/{issue-title}
  - Issue 생성 시 title 의 25 까지 브랜치로 생성되니 영문으로 짧게 작성 후 본문에 내용 채워주세요.
  - Branch name 으로 적절하지 않은 문자(공백 등)는 `_`로 처리됩니다.
  - example
    - setting/#3/project_set_up

</br>

## Commit Convention

---

### Commit Example

**{type}/#{issue-number}: 작업한 사항(띄어쓰기 허용)**

예시

- setting/#3: project set up

### Commit Type

| Type     | Description                          |
| -------- | ------------------------------------ |
| bugfix   | 버그 수정                            |
| db       | 데이터베이스 관련 작업               |
| delete   | 코드 삭제                            |
| doc      | 문서 작업                            |
| feat     | 새로운 기능 추가                     |
| modify   | 코드 수정(기능상의 수정이 있는 경우) |
| refactor | 코드 수정(기능상의 수정이 없는 경우) |
| test     | 테스트코드 관련 작업                 |
| deploy   | 배포 관련 작업                       |
| setting  | 세팅 관련 작업                       |

### Commit Prepare

**`{type}: {description}` 형식을 작성하면 자동으로 이슈번호를 붙여줍니다.**

```bash
cp ./scripts/prepare-commit-msg.sh ./.git/hooks/prepare-commit-msg

chmod ug+x ./.git/hooks/prepare-commit-msg
```

#### 예시

```bash
# branch 가 setting/#3/project_set_up 일 때
$ git commit -m "setting: project set up"
# setting/#3: project set up
```

### Commit Template

커밋 시 `-m` 옵션을 주지 않았을 때 적용됩니다.

```bash
# 커밋 템플릿 적용
git config --local commit.template .github/.COMMIT_TEMPLATE.txt

# 커밋 에디터 vscode 적용 기본은 vi
# 전역으로 설정하려면 --local 을 --global 로 적용하면 됩니다.
git config --local core.editor "code --wait"
```

</br>

## **Script**

### Server Start

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

### **Test**

```bash
# unit test
$ npm run test

# watch mode
$ npm run test:watch

# e2e test
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

</br>

## **Related Projects**

---

- [Dongurami-server-v1](https://github.com/modern-agile-team/dongurami-server)
- [Dongurami-web-front-v1](https://github.com/modern-agile-team/dongurami-front)
- [Dongurami-web-front-v2](https://github.com/modern-agile-team/dongurami-front-v2)

</br>

## **Contributors**

---

- [**SeokHo Lee**](https://github.com/rrgks6221) - <rrgks@naver.com>
- [**BiHo Jeong**](https://github.com/hobiJeong) - <jjb26433@naver.com>
