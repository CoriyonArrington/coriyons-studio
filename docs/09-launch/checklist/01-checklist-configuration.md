--- docs/09-launch/01-checklist-configuration.md ---
# 🛠️ Configuration & Starter Setup Checklist – Coriyon’s Studio

Ensure all foundational configuration, tooling, and environment setups are in place before development begins.

---

## 🔐 Environment & Secrets

| Task                                          | Owner | Status      | Notes                                  |
| --------------------------------------------- | ----- | ----------- | -------------------------------------- |
| Copy `.env.example` → `.env.local`            | Dev   | ✅ Complete | Populate with API keys and URLs        |
| Add `.env.local` to `.gitignore`              | Dev   | ✅ Complete | Prevent accidental commits             |
| Document required env vars in README          | Dev   | 🟡 In Progress | List all variables & purpose           |

## 📦 Dependencies & Tooling

| Task                                          | Owner | Status      | Notes                                  |
| --------------------------------------------- | ----- | ----------- | -------------------------------------- |
| Clean up `package.json` (scripts & deps)      | Dev   | ✅ Complete | Remove unused libraries                |
| Install ESLint, Prettier, and Husky hooks     | Dev   | ✅ Complete | Format & lint on commit                |
| Configure Tailwind CSS and theme integration  | Dev   | 🟡 In Progress | Link to design tokens in `theme.ts`    |

## ⚙️ Local Dev Setup

| Task                                          | Owner | Status      | Notes                                  |
| --------------------------------------------- | ----- | ----------- | -------------------------------------- |
| `npm install` and verify no errors            | Dev   | ✅ Complete | Fresh clone → run install             |
| `npm run dev` to confirm local server         | Dev   | ✅ Complete | Check homepage loads                  |
| Add VSCode recommended extensions (in .vscode)| Dev   | ⬜ Pending   | ESLint, Prettier, Tailwind CSS         |

_⏱ Last updated: May 29, 2025_
