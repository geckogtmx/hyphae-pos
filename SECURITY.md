# Security Policy

> **Status**: Active
> **Last Audit**: 2026-01-16

## 🛡️ Core Principles

1.  **Shift Left**: Security checks happen during development, not just before deployment.
2.  **Zero Trust inputs**: All external data (API, User, Database) must be validated.
3.  **Least Privilege**: Components only get access to the data they need.

## 🚨 Threat Model

| Asset | Threat | Mitigation |
|-------|--------|------------|
| **Customer Data** | SQL Injection | Use Drizzle ORM (No raw SQL). |
| **Transaction Integrity** | Manipulation | Server-side calculation of totals. |
| **API Keys** | Leaked in git | `.env` enforcement, secret scanning. |
| **Local Database** | Unauthorized Access | File permissions, encrypted at rest (Phase 4). |

## 🔒 Mandatory Guidelines

### 1. Input Validation
All external inputs MUST be validated using **Zod** schemas.
- **API Payloads**: Validate on entry.
- **Form Inputs**: Validate on submit.
- **DB Reads**: Typed via Drizzle, but runtime checks recommended for critical data.

### 2. Database Interactions
- **Forbidden**: `db.run('INSERT INTO...')` (Raw SQL strings).
- **Required**: `db.insert(orders).values({...})` (ORM methods).
- **Sanitization**: Drizzle handles parameterization automatically.

### 3. Secret Management
- **Never** commit secrets to git.
- Use `.env` for local development.
- Use OS Keyring (via Electron `safeStorage`) for production tokens (Phase 4).

### 4. Dependency Management
- Run `pnpm audit` weekly.
- Pin dependency versions in `package.json`.

## 🐛 vulnerability Reporting
If you find a security issue, please create a **Private Issue** in the repository or contact the lead developer. Do not file public issues for exploits.
