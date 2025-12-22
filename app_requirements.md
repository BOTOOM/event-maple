# EventMaple – App Requirements

## 1. Product Vision

EventMaple is a web-based, internationalized event discovery and management platform.  
It is **technology-first**, but intentionally open to other types of events.

The platform allows users to **create, publish, discover, and attend events** in a simple, secure, and SEO-friendly way.

EventMaple is:
- A web application
- A Progressive Web App (PWA)
- Server-side rendered (Next.js)
- Internationalized by default
- Built with scalability and security in mind

---

## 2. Target Users

### Attendees
Users who:
- Discover events
- View event details
- Attend events
- Manage their personal profile and preferences

### Event Creators
Users who:
- Create events
- Edit or delete only the events they created
- Manage their own events

> Any user can be an attendee.  
> A user becomes an event creator automatically when they create an event.

---

## 3. Core Features (MVP Scope)

### Events
- Create events
- Edit events (only by the event creator)
- Delete events (only by the event creator)
- View event details

Each event:
- Belongs to **one single category**
- Has timezone-aware start and end dates
- Stores dates in UTC
- Stores its original IANA timezone
- Is fully internationalized
- Is rendered server-side
- Includes SEO metadata

---

### Categories
- A fixed set of **12 core categories**
- Categories are broad and user-friendly
- No subcategories in the MVP
- Each event has **exactly one category**
- Categories are used for:
  - Discovery
  - Filtering
  - SEO

---

### Timezones
- Events store:
  - `start_at` in UTC
  - `end_at` in UTC
  - `timezone` as an IANA string (e.g. `America/Bogota`)
- Event times are displayed correctly based on:
  - Event timezone
  - User locale and timezone
- Timezone handling must work correctly in SSR

---

### User Profiles
Each authenticated user has exactly one profile.

Minimal profile fields (MVP):
- Email (from Supabase Auth)
- Display name
- Avatar
- Preferred locale
- Preferred timezone

The profile exists primarily to:
- Identify the user
- Store preferences
- Support event ownership and permissions

---

### Authentication
- Authentication is handled by Supabase Auth
- The system is designed for **passwordless authentication**
- Magic links and email OTP codes are planned
- The system must not assume password-based authentication

---

## 4. Permissions & Security Model

- Event ownership is determined by a `created_by` field
- Only the user who created an event can:
  - Edit the event
  - Delete the event
- Permissions are enforced at the **database level** using Supabase RLS
- Frontend checks are for UX only and are not security-critical

> Security must never rely solely on frontend logic.

---

## 5. Non-Goals (Explicitly Out of Scope for MVP)

The following features are intentionally **out of scope** for the MVP:

- Social network features (followers, likes, feeds)
- User-to-user messaging
- Role-based access control (RBAC)
- Multi-category events
- Advanced analytics
- Paid events or monetization
- Admin dashboards
- Complex notification systems

---

## 6. Future Considerations (Not MVP)

These features may be considered in future iterations but must not be implemented prematurely:

- Multiple categories per event
- Tags and recommendation systems
- Organizer or company profiles
- Advanced event statistics
- Granular notification preferences
- Search ranking and personalization
- Multi-language content stored in the database

---

## 7. Product Constraints & Principles

- MVP-first mindset
- Prefer simplicity over flexibility
- Avoid premature optimization
- Prioritize:
  - SEO
  - Server-side rendering
  - Security
  - Performance
- The product should remain intuitive and low-friction for users

---

## 8. Guiding Principles

- The event is the core entity of the product
- The profile exists to support events, not to act as a social identity
- Ownership defines permissions
- What defines the product lives in code
- What evolves with usage may live in the database
