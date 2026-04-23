# Improvements

## Gmail Integration

### Secure token storage with macOS Keychain

Gmail OAuth tokens (access token, refresh token) are currently stored in plaintext in the SQLite `settings` table. For production use, these should be migrated to the native macOS Keychain using the `keytar` package:

```bash
npm install keytar
```

`keytar` provides a cross-platform API for storing credentials in the OS-level keychain (macOS Keychain, Windows Credential Vault, Linux libsecret). This ensures tokens are encrypted at rest and protected by the OS.

### Automatic token refresh

The current implementation stores the access token but does not automatically refresh it when it expires (~1 hour). A middleware or utility should be added that:

1. Checks `GMAIL_TOKEN_EXPIRY` before making Gmail API calls
2. If expired, uses the refresh token to obtain a new access token
3. Updates the stored tokens transparently

### Multiple Gmail accounts

Currently only one Gmail account can be connected at a time. Support for multiple accounts would require:

- Namespaced settings keys (e.g., `GMAIL_ACCOUNT_1_*`, `GMAIL_ACCOUNT_2_*`)
- An account picker in the UI
- Per-routine account selection
