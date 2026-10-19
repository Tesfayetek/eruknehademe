# Security Specification & Threat Model: User-Level Data Privacy
## Erukneh Ademe Business Consulting

### 1. Primary Data Invariants
1. **Strict User-Level Privacy & Ownership**: Every authenticated user can read and manage ONLY their own private account and profile data (`/users/{userId}`). No ordinary user may read, list, query, update, or delete another user's private account information.
2. **Global Listing Prohibition**: Collection-wide queries (`allow list`) on `/users` are strictly restricted to verified administrators (`isAdmin()`). Client applications are prevented from querying or scraping any list of user records.
3. **Protected Sensitive Fields**:
   - `uid`: Immutable, must match `request.auth.uid`.
   - `role`: Immutable by ordinary users (`incoming().role == existing().role`). Ordinary users cannot grant themselves administrator privileges.
   - `status`: Immutable by ordinary users (`incoming().status == existing().status`).
   - `email`: Immutable by ordinary users (`incoming().email == existing().email`).
   - `emailVerified`: Immutable by ordinary users (`incoming().emailVerified == existing().emailVerified`).
   - `createdAt`: Immutable (`incoming().createdAt == existing().createdAt`).
   - **Permitted Fields for User Update**: ONLY `['displayName', 'phone', 'company', 'updatedAt']` via `affectedKeys().hasOnly(...)`.
4. **Subcollection Privacy**: Any nested subcollections under `/users/{userId}/{subcollection=**}` are bound to the parent user's `isOwner(userId)` or `isAdmin()`.
5. **Private Inquiries & Consultation Records**:
   - `/consultationRequests/{id}` contains client contact data and project descriptions.
   - For authenticated users, `userId` is bound to `request.auth.uid`.
   - Access (`get`, `list`) is restricted to the document owner (`resource.data.userId == request.auth.uid`) or `isAdmin()`.
   - Ordinary users cannot view or query consultations belonging to another client.
6. **Private Contact Submissions**:
   - `/contactMessages/{id}` submissions can be created by visitors, but can ONLY be read, listed, or managed by `isAdmin()`. No customer or visitor can access other contact submissions.
7. **Role Registry Protection**:
   - `/admins/{id}` is inaccessible to ordinary users (`allow get, list, write: if isAdmin()`).
8. **Audit Trail Integrity**:
   - `/auditLogs/{id}` is append-only by administrators and completely immutable (`allow update, delete: if false`).

---

### 2. Threat Scenarios & Access Matrix

| Role | Target Document | Operation | Allowed? | Enforcement Mechanism |
|---|---|---|---|---|
| Unauthenticated Visitor | `/users/userA` | `get` | **DENIED** | `isOwner(userId)` requires `request.auth != null` |
| User A | `/users/userA` | `get` | **ALLOWED** | `request.auth.uid == 'userA'` satisfies `isOwner` |
| User A | `/users/userB` | `get` | **DENIED** | `request.auth.uid != 'userB'` and not admin |
| User A | `/users` | `list` | **DENIED** | `allow list: if isAdmin()` rejects non-admin |
| User A | `/users/userB` | `update` | **DENIED** | `isOwner` and `isAdmin` both evaluate to false |
| User A | `/users/userA` | `update (role="admin")` | **DENIED** | `incoming().role == existing().role` & `affectedKeys().hasOnly(['displayName', 'phone', 'company', 'updatedAt'])` |
| User A | `/users/userA` | `update (emailVerified=true)` | **DENIED** | `incoming().emailVerified == existing().emailVerified` |
| User A | `/users/userA` | `update (displayName="New Name")` | **ALLOWED** | Validated update with permitted fields |
| User A | `/consultationRequests` (filtered by User B) | `list` | **DENIED** | `resource.data.userId == request.auth.uid` evaluates false |
| User A | `/consultationRequests` (filtered by User A) | `list` | **ALLOWED** | `resource.data.userId == request.auth.uid` matches |
| User A | `/contactMessages` | `list` / `get` | **DENIED** | Restricted strictly to `isAdmin()` |
| User A | `/admins/anyAdmin` | `get` / `write` | **DENIED** | Restricted strictly to `isAdmin()` |
| Admin (`arabsafashion@gmail.com`) | `/users` | `list` / `get` / `update` | **ALLOWED** | Verified admin check |
