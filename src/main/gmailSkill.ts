import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';

const SKILL_DIR = path.join(app.getPath('home'), '.config', 'opencode', 'skills', 'gmail');
const SKILL_PATH = path.join(SKILL_DIR, 'SKILL.md');

/**
 * Write (or overwrite) the Gmail SKILL.md so opencode agents can discover it.
 * Agents fetch the Bearer token at runtime via a local token endpoint —
 * the token is never stored in prompts or run metadata.
 */
export function writeGmailSkill(): void {
  const content = `---
name: gmail
description: Read-only access to the user's Gmail inbox via the Gmail API
---

## What I do

Provide read-only access to the user's Gmail inbox: list messages, read full content, list labels.

## When to use me

Use this skill when the user asks you to read, search, summarise, or analyse their emails.

## Step 1 — Get your Bearer token

The Gmail token endpoint URL is provided in the execution context under "Gmail token endpoint".
Fetch the token before making any Gmail API calls:

\`\`\`bash
TOKEN=$(curl -s "<token endpoint URL>" | jq -r '.token')
\`\`\`

## Step 2 — Call the Gmail API

Base URL: \`https://gmail.googleapis.com/gmail/v1/users/me\`

### List messages
\`\`\`bash
curl -s -H "Authorization: Bearer $TOKEN" \\
  "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=<search>&maxResults=<n>"
\`\`\`
- **q**: Gmail search syntax (e.g. \`from:alice is:unread\`, \`subject:invoice\`)
- **maxResults**: 1–500, default 100
- **Returns**: \`{ messages: [{id, threadId}], nextPageToken, resultSizeEstimate }\`

### Get message
\`\`\`bash
curl -s -H "Authorization: Bearer $TOKEN" \\
  "https://gmail.googleapis.com/gmail/v1/users/me/messages/<id>?format=full"
\`\`\`
- Use \`?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date\` for headers only (faster)
- Body parts are base64url-encoded — decode with: \`echo "<data>" | tr '_-' '/+' | base64 -d\`

### List labels
\`\`\`bash
curl -s -H "Authorization: Bearer $TOKEN" \\
  "https://gmail.googleapis.com/gmail/v1/users/me/labels"
\`\`\`

## Tips

- Pipe responses through \`jq\` for readability
- Common queries: \`is:unread\`, \`in:inbox\`, \`from:someone@example.com\`
- Fetch token once per session and reuse it across multiple API calls
`;

  fs.mkdirSync(SKILL_DIR, { recursive: true });
  fs.writeFileSync(SKILL_PATH, content);
}

/**
 * Remove the Gmail SKILL.md (e.g. on app uninstall).
 */
export function removeGmailSkill(): void {
  try {
    fs.unlinkSync(SKILL_PATH);
    fs.rmdirSync(SKILL_DIR);
  } catch {
    /* ignore — may not exist */
  }
}
