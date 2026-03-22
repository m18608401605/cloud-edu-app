# Backup And Restore

## Code Baseline

- Backup branch: `codex/pre-auth-analytics-baseline-2026-03-22`
- Backup tag: `pre-auth-analytics-baseline-2026-03-22`
- Archive: `/Users/a1/Documents/New project/backups/cloud-edu-app-pre-auth-analytics-baseline-2026-03-22.tar.gz`

## Local Data Backup

Use the backup section on the stats page to export a JSON snapshot before making major changes.

The exported file includes:

- `appState`
- `tasks`
- `dailyPlans`
- `dailyRecords`
- `rewards`
- `redeemRecords`
- `users`
- `childProfiles`
- `profileSnapshots`
- `voiceSessions`

## Restore Flow

1. Open the app in the same browser profile.
2. Go to the stats page.
3. Use `导入恢复备份`.
4. Select the exported JSON file.
5. Wait for the success message and verify points, streak, tasks, plans, and rewards.

## Code Rollback

- Preferred: `git checkout codex/pre-auth-analytics-baseline-2026-03-22`
- Exact baseline: `git checkout pre-auth-analytics-baseline-2026-03-22`
- Archive fallback: extract the `.tar.gz` backup into a clean folder
