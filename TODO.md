# TODO

## Auto-update notifications

Currently users have no way to know a new version is available after installing.

### Recommended approach: manual version check

- On app startup, poll the GitHub API for the latest release tag
- Compare with `app.getVersion()`
- If a newer version exists, show a non-intrusive banner or notification with a download link
- ~30 lines of code, works with private repos, no infrastructure needed

### Future: full auto-update

- Use `update-electron-app` (Electron's official package) for auto-download + install prompts
- Requires a public GitHub repo with releases
- Needs `@electron-forge/maker-zip` or `@electron-forge/maker-squirrel` targets
- Uses `update.electronjs.org` as a free update proxy

## Better error handling for provider auth failures

When a model provider (e.g. GitHub Copilot) has an expired or malformed token, the run fails with a raw API error like `"Authorization header is badly formatted"`. This is confusing.

- Intercept auth-related errors (400/401) in the executor and surface a user-friendly message (e.g. "GitHub Copilot authentication expired — reconnect in Settings")
- Show the provider as disconnected in the Settings UI when auth fails
- Consider periodic health checks on provider tokens to detect stale auth proactively
