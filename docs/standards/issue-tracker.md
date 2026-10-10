# Issue Tracker Standards

Issues and specs live as GitHub issues for `ngxccc/open-spend`. Use the `gh` CLI for all operations.

## Conventions

- **Create**: `gh issue create --title "..." --body "..."`
- **Read**: `gh issue view <number> --comments`
- **List**: `gh issue list --state open --json number,title,body,labels,comments`
- **Comment / Label / Close**: `gh issue comment <number> --body "..."`, `gh issue edit --add-label "..."`, `gh issue close <number>`
- **PRs as triage surface**: Set `PRs as a request surface: no` (or `yes` if triaging contributor PRs).
- **Native Sub-Issues**:
  - Link Child to Parent: `CHILD_ID=$(gh api repos/{owner}/{repo}/issues/<child_number> --jq .id) && gh api --method POST repos/{owner}/{repo}/issues/<parent_number>/sub_issues -F sub_issue_id=$CHILD_ID`
  - List Sub-Issues: `gh api repos/{owner}/{repo}/issues/<parent_number>/sub_issues --jq '.[] | "#\(.number): \(.title)"'`

## Wayfinding Operations (`/wayfinder`)

- **Map**: Single issue labeled `wayfinder:map`.
- **Child ticket**: Sub-issue linked to map with label `wayfinder:<type>` (`research`/`prototype`/`grilling`/`task`).
- **Blocking**: Native dependencies (`repos/<owner>/<repo>/issues/<child>/dependencies/blocked_by`).
- **Claim & Resolve**: `gh issue edit <n> --add-assignee @me` $\rightarrow$ close and link in map Decisions.

---

## Triage Label Vocabulary

The engineering skills speak in terms of five canonical triage roles mapped to tracker labels:

| Canonical Role    | Tracker Label     | Meaning                                  |
| :---------------- | :---------------- | :--------------------------------------- |
| `needs-triage`    | `needs-triage`    | Maintainer needs to evaluate this issue  |
| `needs-info`      | `needs-info`      | Waiting on reporter for more information |
| `ready-for-agent` | `ready-for-agent` | Fully specified, ready for an AFK agent  |
| `ready-for-human` | `ready-for-human` | Requires human implementation            |
| `wontfix`         | `wontfix`         | Will not be actioned                     |
