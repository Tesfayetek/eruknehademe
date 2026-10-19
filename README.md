# Erukneh Ademe Business Consulting Platform

A production-oriented, responsive web application and content management system for **Erukneh Ademe Business Consulting**, serving domestic enterprises in Ethiopia and international partners across East Africa and beyond.

## Brand & Visual Identity
- **Primary Color:** Deep Navy Blue (`#10283F` / `#0a1826`)
- **Accent Color:** Sophisticated Gold (`#D5A13A` / `#e6b956`)
- **Typography:** Serif headings (*Playfair Display* / *Cinzel*) paired with clean sans-serif body (*Plus Jakarta Sans*)
- **Context:** Authentic Ethiopian commercial grounding (Addis Ababa, Bole Sub-City, Hawassa & Kilinto industrial corridors, AfCFTA trade) and international corporate standards.

---

## Architecture & Technology Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion
- **Database:** Cloud Firestore (`ai-studio-eruknehademebusi-8b59b9f9-aa21-44ff-8a9b-9d8c4493a8c9`)
- **Authentication:** Firebase Authentication (Email/Password & Google OAuth) with Email Verification handling
- **Storage:** Firebase Cloud Storage for high-resolution corporate media assets
- **Security:** Deployed Firestore Security Rules (`firestore.rules`) and Cloud Storage Rules (`storage.rules`) enforcing Attribute-Based Access Control (ABAC), PII isolation, and role authorization.

---

## Roles & Permissions

### Role A: Website Administrator
Configured for: `arabsafashion@gmail.com` and records in `/admins/{uid}`
- Complete access to the protected administration CMS (`/admin`).
- Real-time Firestore summary metrics (customers, verifications, articles, active practices, pending inquiries).
- Full CRUD for Services, Industries, Thought Leadership Articles, Testimonials, and Media Library.
- Review and status management for Consultation Requests (`pending` -> `reviewed` -> `scheduled` -> `completed` -> `archived`) with internal client feedback notes.
- Customer account management with active/inactive activation toggle.
- Site settings & SEO metadata editor.
- Immutable audit log tracking.

### Role B: Customer / Client
- Self-registration with required acceptance of Terms and Privacy Policy.
- Email verification flow with resend capability.
- View and update permitted profile fields (Name, Phone, Company).
- Submit confidential Consultation Requests and Contact Inquiries.
- Track real-time status and partner notes on submitted consultation inquiries.
- Prevented from accessing CMS routes, elevating roles, or viewing other clients' PII.

---

## Firestore Schema & Collections
- `/users/{userId}`: User profile, role (`customer` | `admin`), status (`active` | `inactive`), email verification status.
- `/admins/{adminId}`: Authorized administrator lookup mapping.
- `/siteSettings/general`: Global website configuration, hero texts, office addresses, phone numbers, founder bio, and SEO tags.
- `/services/{serviceId}`: Practice areas (Corporate Strategy, Financial Advisory, Feasibility Studies, PMO, etc.).
- `/industries/{industryId}`: Configurable target sectors (Manufacturing, Agriculture, Logistics, Startups, NGOs, FDI).
- `/articles/{articleId}`: Thought leadership articles with categories, tags, and read-time estimates.
- `/media/{mediaId}`: Media library metadata and storage paths.
- `/testimonials/{testimonialId}`: Verified client endorsements and ratings.
- `/consultationRequests/{requestId}`: Inbound client consultation bookings.
- `/contactMessages/{messageId}`: Public inquiries from the contact form.
- `/auditLogs/{logId}`: Append-only administrative action trail.

---

## Security Invariants
1. Default-deny catch-all rule on Firestore and Storage.
2. Self-assigned admin role attempts on client registration are rejected by rules (`incoming().role == 'customer'`).
3. User PII is protected: only the owner or an authorized administrator can read customer profile documents.
4. Input validation and string length boundary limits prevent denial-of-wallet resource exhaustion.
5. All Firestore operations incorporate standardized error handling via `handleFirestoreError`.
