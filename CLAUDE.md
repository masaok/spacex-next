### Claude

- Do not verify build unless told to. Use `bun ci` instead.
- Use bun instead of npm when possible
- Never build or push unless told to do so.

### GitHub

- Always show commit hash after commit and push
- Always use git add -A
- Never use --no-verify.  Never commit or push unless all checks pass.

### NextJS

- Always use async/await
- Always use Axios instead of fetch
- Always use Luxon instead of JSDate

### Testing

- Add retry logic and proper timeout handling to integration tests
- Remove all console logs from tests