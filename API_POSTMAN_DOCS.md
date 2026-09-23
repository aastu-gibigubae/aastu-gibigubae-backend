# AASTU Gibi Gubae API Documentation

Base URL: `http://localhost:3000/api` (Adjust port based on your `.env`)

### Authentication
Most admin routes require a Bearer token in the `Authorization` header.
- **Header Format:** `Authorization: Bearer <your_jwt_token>`
- Sub-Admin users must also have the specific `ScopeArea` permission assigned to manage a module. Main `ADMIN` users can access everything.

---

## 1. Events Module (`/api/events`)

### Public Routes
- **GET** `/api/events` - Get published events.
  - **Query Params:** `page` (int, >0), `limit` (int, 1-50), `search` (string), `fromDate` (ISO date), `toDate` (ISO date), `sortBy` (`event_date`, `title`, `created_at`), `sortOrder` (`asc`, `desc`)
- **GET** `/api/events/:id` - Get a specific published event by UUID.

### Admin Routes (Requires Auth + `EVENTS` Scope)
- **GET** `/api/events/admin/all` - Get all events (including unpublished).
  - **Query Params:** Same as public GET.
- **GET** `/api/events/admin/:id` - Get a specific event (published or unpublished).
- **POST** `/api/events` - Create a new event.
  - **Payload:**
    ```json
    {
      "title": "String (1-150 chars, required)",
      "description": "String (1-5000 chars, required)",
      "location": "String (1-250 chars, required)",
      "eventDate": "ISO 8601 Date String (required, e.g., '2026-10-01T14:30:00Z')",
      "userId": "UUID String (required)",
      "imageUrl": "URL String (optional, max 2000 chars)",
      "isPublished": "Boolean (optional, default false)"
    }
    ```
- **PATCH** `/api/events/:id` - Update an existing event.
  - **Payload:** Same as POST, but all fields are optional.
- **DELETE** `/api/events/:id` - Delete an event by UUID.

---

## 2. Leaders Module (`/api/leaders`)

### Public Routes
- **GET** `/api/leaders` - Get all leaders.
- **GET** `/api/leaders/:id` - Get a specific leader by UUID.

### Admin Routes (Requires Auth + `LEADERSHIP` Scope)
- **POST** `/api/leaders` - Add a new leader.
  - **Payload:**
    ```json
    {
      "name": "String (1-255 chars, required)",
      "role": "String (1-255 chars, required)",
      "biography": "String (min 1 char, required)",
      "userId": "UUID String (required)",
      "contact": "String (optional)",
      "image_url": "URL String (optional)"
    }
    ```
- **PUT** `/api/leaders/:id` - Update a leader.
  - **Payload:** Same as POST, all fields optional. At least one field required.
- **DELETE** `/api/leaders/:id` - Delete a leader.

---

## 3. Announcements Module (`/api/announcements`)

### Public Routes
- **GET** `/api/announcements` - List active, non-expired announcements.
- **GET** `/api/announcements/:id` - Get an active announcement.

### Admin Routes (Requires Auth + `ANNOUNCEMENTS` Scope)
- **GET** `/api/announcements/admin/:id` - Get any announcement (bypasses active/expiry filters).
- **POST** `/api/announcements` - Create an announcement.
  - **Payload:**
    ```json
    {
      "title": "String (1-255 chars, required)",
      "content": "String (min 1 char, required)",
      "expires_at": "ISO 8601 Date String (required)",
      "userId": "UUID String (required)",
      "is_active": "Boolean (optional)"
    }
    ```
- **PUT** `/api/announcements/:id` - Update an announcement.
  - **Payload:** Same as POST, all fields optional. At least one field required.
- **DELETE** `/api/announcements/:id` - Delete an announcement.

---

## 4. Alehu Bewere (Donations) Module (`/api/alehu-bewere`)

### Public Routes
- **GET** `/api/alehu-bewere/packages` - List available donation packages.
- **POST** `/api/alehu-bewere/subscriptions` - Submit a new donation subscription.
  - *Note: Supports optional Auth. If a token is provided, `user_id` is automatically captured.*
  - **Payload:**
    ```json
    {
      "full_name": "String (max 100 chars, required)",
      "phone_number": "String (valid phone format e.g. +251911234567, required)",
      "package_name": "String (required)",
      "amount": "Number (positive, optional - required only for custom packages)",
      "email": "Email String (optional)"
    }
    ```

### Admin Routes (Requires Auth + `ALEHU_BEWERE` Scope)
- **GET** `/api/alehu-bewere/subscriptions` - List all subscriptions.
- **GET** `/api/alehu-bewere/subscriptions/:id` - Get specific subscription details.
- **PATCH** `/api/alehu-bewere/subscriptions/:id` - Update a subscription status.
  - **Payload:**
    ```json
    {
      "status": "String (Required. Must be: 'PENDING', 'CONTACTED', 'CONFIRMED', or 'REJECTED')",
      "admin_note": "String (optional, allows null)"
    }
    ```

---

## 5. Magazine Module (`/api/magazines`)

### Public Routes
- **GET** `/api/magazines` - List published magazines.
- **GET** `/api/magazines/:id` - Get a published magazine.

### Admin Routes (Requires Auth + `MAGAZINE` Scope)
- **GET** `/api/magazines/admin/all` - List all magazines.
- **GET** `/api/magazines/admin/:id` - Get any magazine.
- **POST** `/api/magazines` - Create a magazine.
  - **Payload:**
    ```json
    {
      "title": "String (1-200 chars, required)",
      "pdfUrl": "URL String (required, max 2000 chars)",
      "userId": "UUID String (required)",
      "coverImage": "URL String (optional, max 2000 chars)",
      "content": "String (optional, max 50000 chars)"
    }
    ```
- **PATCH** `/api/magazines/:id` - Update a magazine.
  - **Payload:** Same as POST, all fields optional.
- **DELETE** `/api/magazines/:id` - Delete a magazine.

---

## 6. Kiflat Module (`/api/kiflats`)

### Public Routes
- **GET** `/api/kiflats` - List Kiflats (supports search, pagination).
- **GET** `/api/kiflats/:id` - Get Kiflat by ID.

### Admin Routes (Requires Auth + `KIFLAT` Scope)
- **POST** `/api/kiflats` - Create Kiflat.
  - **Payload:**
    ```json
    {
      "name": "String (1-150 chars, required)",
      "description": "String (optional, max 5000 chars)",
      "imageUrls": ["Array of URL Strings (optional, max 2000 chars each)"]
    }
    ```
- **PATCH** `/api/kiflats/:id` - Update Kiflat.
  - **Payload:** Same as POST, all fields optional.
- **DELETE** `/api/kiflats/:id` - Delete Kiflat.

---

## 7. Sub-Kiflat Module (`/api/sub-kiflats`)

### Public Routes
- **GET** `/api/sub-kiflats` - List Sub-Kiflats (supports `kiflatId` filter, search, pagination).
- **GET** `/api/sub-kiflats/:id` - Get Sub-Kiflat by ID.

### Admin Routes (Requires Auth + `KIFLAT` Scope)
- **POST** `/api/sub-kiflats` - Create Sub-Kiflat.
  - **Payload:**
    ```json
    {
      "kiflatId": "UUID String (required, links to parent Kiflat)",
      "name": "String (1-150 chars, required)",
      "description": "String (optional, max 5000 chars)",
      "imageUrls": ["Array of URL Strings (optional)"]
    }
    ```
- **PATCH** `/api/sub-kiflats/:id` - Update Sub-Kiflat.
  - **Payload:** Same as POST, all fields optional.
- **DELETE** `/api/sub-kiflats/:id` - Delete Sub-Kiflat.

---

## 8. Gallery Module (`/api/gallery`)

### Public Routes
- **GET** `/api/gallery` - List gallery images.
- **GET** `/api/gallery/:id` - Get gallery image.

### Admin Routes (Requires Auth + `GALLERY` Scope)
- **POST** `/api/gallery` - Add an image.
  - **Payload:**
    ```json
    {
      "title": "String (1-255 chars, required)",
      "image_url": "URL String (required)",
      "description": "String (optional, max 2000 chars)"
    }
    ```
- **PATCH** `/api/gallery/:id` - Update an image.
  - **Payload:** Same as POST, all fields optional.
- **DELETE** `/api/gallery/:id` - Delete an image.

---

## 9. Admin Scopes (Module Permissions) (`/api/admin/sub-admins`)

### Admin Routes (Requires Auth + STRICT `ADMIN` Role)
*These endpoints are used by the main administrator to grant/revoke module access to Sub-Admins.*

- **GET** `/api/admin/sub-admins/:userId/scopes` - List a sub-admin's granted scopes.
- **POST** `/api/admin/sub-admins/:userId/scopes` - Grant a module scope to a sub-admin.
  - **Payload:**
    ```json
    {
      "scope_area": "String (Required. Must be: 'EVENTS', 'LEADERSHIP', 'MEDIA', 'MAGAZINE', 'ANNOUNCEMENTS', 'GALLERY', 'KIFLAT', or 'ALEHU_BEWERE')"
    }
    ```
- **DELETE** `/api/admin/sub-admins/:userId/scopes/:scope_area` - Revoke a specific module scope.
