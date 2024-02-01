# Commit Convention

**Commit Type, 티켓번호를 명시하여 커밋메시지를 남긴다.**

### Type

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

### Rule

```txt
# Head: Required
{type}/{jira-number}: {summary}

# Body: Optional
{추가 내용(없으면 적지 않아도 됨)}

# Footer Required
{jira-url}/browse/{jira-number}
```

#### Example

##### 추가 내용이 있는 경우

```bash
doc/QYOG-54: commit convention 문서 생성

README가 너무 커지기 때문에 별도 디렉토리에 문서 분리

https://dongurami.atlassian.net/browse/QYOG-54
```

##### 추가 내용이 없는 경우

```bash
doc/QYOG-54: commit convention 문서 생성

https://dongurami.atlassian.net/browse/QYOG-54
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

### Commit Prepare

**`{type}: {description}` 형식을 작성하면 자동으로 지라이슈번호를 붙여줍니다.**

#### 적용

```bash
cp ./scripts/prepare-commit-msg.sh ./.git/hooks/prepare-commit-msg && chmod ug+x ./.git/hooks/prepare-commit-msg
```

#### Example

##### -m 옵션을 사용하는 경우

```bash
# branch가 auto/QYOG-54 인 경우
$ git commit -m "doc: commit convention"
```

![image](https://github.com/modern-agile-team/dongurami-server-v2/assets/46591459/77ecd81e-0ae1-4e22-be08-a03afac09a68)

##### -m 옵션을 사용하지 않는 경우

```bash
# branch가 auto/QYOG-54 인 경우
$ git commit
```

- 아래 사진처럼 기본값을 가진 채 에디터가 열림
- commitType을 수정하고 적용

<img width="547" alt="image" src="https://github.com/modern-agile-team/dongurami-server-v2/assets/46591459/214b0f5f-0602-4600-be4f-60a114782271">
