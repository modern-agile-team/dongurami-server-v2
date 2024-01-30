# Github Label Apply

[라벨 적용 문서](https://velog.io/@rimo09/Github-github-label-%ED%95%9C%EB%B2%88%EC%97%90-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)

깃허브 라벨 적용은 [labels.json](../../.github/labels.json)을 통해 한다.

1. [labels.json](../../.github/labels.json) 수정
2. label 적용 command

```bash
$ npx github-label-sync --access-token "{your_access_token}" --labels ./.github/labels.json "modern-agile-team/dongurami-server-v2"
```
