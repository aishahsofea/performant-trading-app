# Authentication System Architecture - Performant Trading App

## High-Level Architecture Overview

```mermaid
graph TB
    subgraph "CLIENT SIDE (Browser)"
        A[NextAuth SessionProvider] --> B[User Interface]
        B --> C[Auth Forms]
        A --> D[useSession Hook]
        E[JWT Token Storage] --> D
        E --> F[HTTP Requests]
    end

    subgraph "SERVER SIDE (Next.js)"
        subgraph "Middleware Layer"
            G[Next.js Middleware]
            G --> H[withAuth Wrapper]
            H --> I[Token Validation]
            I --> J[Session Age Check]
            J --> K[Inactivity Check]
            K --> L[Role-based Authorization]
            L --> M[Route Permission Check]
        end

        subgraph "API Layer"
            N[NextAuth API Routes]
            N --> O[Auth Providers]
            O --> P[Credentials Provider]
            O --> Q[Google OAuth Provider]
            N --> R[Protected API Routes]
            R --> S[Authorization Guards]
            T[Registration API]
        end

        subgraph "Database Layer"
            U[(Supabase PostgreSQL)]
            U --> V[users table]
            U --> W[userProfiles table]
            U --> X[accounts table]
            U --> Y[sessions table]
m            U --> Z[verification_tokens]
            U --> AA[passwords table]
        end
    end

    F --> G
    N --> U
    R --> U
    T --> U
```

## Detailed Authentication Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant CF as Client Form
    participant NA as NextAuth
    participant MW as Middleware
    participant DB as Database
    participant JWT as JWT Token

    Note over U,JWT: 1. LOGIN PROCESS
    U->>CF: Enter credentials
    CF->>CF: Validate form input
    CF->>NA: signIn() with credentials
    NA->>DB: Query user by email
    DB-->>NA: Return user data
    NA->>NA: Validate password (bcrypt)
    NA->>JWT: Create JWT token
    JWT-->>NA: Return signed token
    NA-->>CF: Authentication success
    CF->>CF: Redirect to callback URL

    Note over U,JWT: 2. ROUTE PROTECTION
    U->>MW: Request protected route
    MW->>MW: Extract JWT from request
    MW->>MW: Verify token signature
    MW->>MW: Check token expiry (24h max)
    MW->>MW: Check inactivity (4h max)
    alt Token valid
        MW-->>U: Allow access
    else Token invalid/expired
        MW->>U: Redirect to /auth/login
    end

    Note over U,JWT: 3. SESSION REFRESH
    U->>NA: Make authenticated request
    NA->>JWT: Check token age
    alt Token > 1 hour old
        NA->>JWT: Issue new token
        JWT->>JWT: Update lastActivity
        JWT-->>U: New token in response
    else Token fresh
        JWT-->>U: Continue with current token
    end
```

## Authorization Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant MW as Middleware
    participant AC as Auth Check
    participant DB as Database
    participant UI as UI Component

    Note over U,UI: ROLE-BASED ACCESS CONTROL

    U->>MW: Request protected route
    MW->>AC: checkMiddlewareAuth()
    AC->>AC: Extract user role from token
    AC->>AC: Check route permissions

    alt Route allowed for role
        MW-->>U: Allow access
        U->>UI: Render protected content
        UI->>AC: useAuth() hook
        AC-->>UI: Return user role & permissions
        UI->>UI: Conditional rendering based on role
    else Route not allowed
        MW->>U: Redirect to /unauthorized
    end

    Note over U,UI: API AUTHORIZATION

    U->>MW: API request to protected endpoint
    MW->>AC: requireAuth(allowedRoles)
    AC->>DB: Verify user session
    DB-->>AC: Return user data
    AC->>AC: Check user role vs allowed roles

    alt Role authorized
        AC-->>MW: Return auth context
        MW-->>U: Process request
    else Role not authorized
        AC-->>MW: Throw authorization error
        MW-->>U: Return 401 Unauthorized
    end
```

## Component Architecture Breakdown

### Frontend (Client-Side) Components

```mermaid
graph TB
    subgraph "React Components"
        A[SessionProvider Wrapper] --> B[Auth Pages]
        B --> C[LoginForm.tsx]
        B --> D[RegisterForm.tsx]
        B --> E[LogoutPage.tsx]

        A --> F[Protected Components]
        F --> G[Profile Pages]
        F --> H[Dashboard Components]

        A --> I[Auth Utilities]
        I --> J[useSession Hook]
        I --> K[signIn/signOut Functions]
        I --> L[Authorization Hooks]
        L --> M[useAuth Hook]
        L --> N[useRequireAuth Hook]
        L --> O[useRouteAuth Hook]

        A --> P[Authorization Components]
        P --> Q[AuthGuard]
        P --> R[ConditionalRender]
        P --> S[withPageAuth HOC]
    end

    subgraph "Client-Side Security"
        T[Form Validation]
        U[Input Sanitization]
        V[CSRF Protection]
        W[Secure Cookie Storage]
        X[Role-based UI Protection]
    end

    C --> T
    D --> T
    J --> W
    Q --> X
```

### Backend (Server-Side) Architecture

```mermaid
graph TB
    subgraph "NextAuth Configuration"
        A[authOptions] --> B[Providers Config]
        B --> C[Credentials Provider]
        B --> D[Google OAuth Provider]

        A --> E[Session Strategy]
        E --> F[JWT Strategy]

        A --> G[Callbacks]
        G --> H[JWT Callback]
        G --> I[Session Callback]

        A --> J[Events]
        J --> K[signIn Event]
        J --> L[signOut Event]
    end

    subgraph "Authorization Layer"
        M[Authorization Config]
        M --> N[User Roles Definition]
        M --> O[Route Permissions]
        M --> P[Role Assignment Logic]

        Q[Authorization Utilities]
        Q --> R[getUserRole Function]
        Q --> S[checkRoutePermission]
        Q --> T[requireAuth Function]
    end

    subgraph "Database Schema"
        U[Drizzle ORM] --> V[User Tables]
        V --> W[users - Core auth data]
        V --> X[userProfiles - Extended data]
        V --> Y[accounts - OAuth links]
        V --> Z[sessions - DB sessions]
        V --> AA[verification_tokens]

        Note: User roles stored in users.role field (future enhancement)
    end

    subgraph "Security Layer"
        BB[Password Hashing]
        BB --> CC[bcrypt - 12 rounds]
        DD[Token Security]
        DD --> EE[JWT Signing]
        DD --> FF[Secure Headers]
        GG[Session Validation]
        GG --> HH[Age Validation]
        GG --> II[Activity Tracking]
        JJ[Authorization Security]
        JJ --> KK[Role-based Access Control]
        JJ --> LL[Permission Validation]
    end
```

## Security Implementation Details

### Password Security Flow

```mermaid
flowchart TD
    A[User Password Input] --> B[Client-Side Validation]
    B --> C{Strong Password?}
    C -->|No| D[Show Error Message]
    C -->|Yes| E[Send to Server]
    E --> F[Server-Side Validation]
    F --> G[bcrypt Hash with 12 Salt Rounds]
    G --> H[Store Hashed Password]

    subgraph "Password Requirements"
        I[Minimum 8 characters]
        J[Uppercase letter]
        K[Lowercase letter]
        L[Number]
        M[Special character]
    end

    B --> I
    B --> J
    B --> K
    B --> L
    B --> M
```

### JWT Token Structure and Validation

```mermaid
graph TB
    subgraph "JWT Token Payload"
        A[Header]
        A --> B[Algorithm: HS256]
        A --> C[Type: JWT]

        D[Payload]
        D --> E[id: User ID]
        D --> F[email: User Email]
        D --> G[name: User Name]
        D --> H[iat: Issued At]
        D --> I[exp: Expires At]
        D --> J[lastActivity: Timestamp]
        D --> K[provider: Auth Provider]

        L[Signature]
        L --> M[HMAC SHA256]
        L --> N[NEXTAUTH_SECRET]
    end

    subgraph "Token Validation Process"
        O[Extract Token] --> P[Verify Signature]
        P --> Q[Check Expiry]
        Q --> R[Validate Payload]
        R --> S[Check Session Age]
        S --> T[Check Inactivity]
    end
```

### Route Protection Matrix

| Route Pattern   | Protection Level | Required Roles       | Middleware Action    |
| --------------- | ---------------- | -------------------- | -------------------- |
| `/`             | Public           | None                 | Allow                |
| `/auth/*`       | Public           | None                 | Allow                |
| `/api/auth/*`   | Public           | None                 | Allow                |
| `/_next/*`      | Public           | None                 | Allow                |
| `/profile`      | Protected        | user, admin, premium | Require Auth + Role  |
| `/dashboard`    | Protected        | user, admin, premium | Require Auth + Role  |
| `/performance`  | Protected        | user, admin, premium | Require Auth + Role  |
| `/solar-system` | Premium          | premium, admin       | Require Premium Role |
| `/admin`        | Admin Only       | admin                | Require Admin Role   |
| `/api/user/*`   | Protected        | user, admin, premium | Require Auth + Role  |
| `/unauthorized` | Public           | None                 | Allow                |

### Session Management Timeline

```mermaid
gantt
    title Session Lifecycle Management
    dateFormat X
    axisFormat %H:%M

    section Session States
    Active Session    :active, 0, 24
    Auto Refresh      :milestone, 1
    Inactivity Warning:milestone, 20
    Inactivity Expiry :milestone, 24
    Age Expiry        :milestone, 24

    section Security Checks
    Token Validation  :0, 24
    Activity Tracking :0, 24
    Age Monitoring    :0, 24
```

## Authentication Provider Comparison

### Credentials Provider Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Login Form
    participant A as Auth API
    participant DB as Database

    U->>F: Enter email/password
    F->>A: POST credentials
    A->>DB: Query user by email
    DB-->>A: Return user data
    A->>A: Validate password (bcrypt)
    A->>A: Create JWT token
    A-->>F: Return session
    F->>F: Redirect to dashboard
```

### Google OAuth Provider Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Login Form
    participant G as Google OAuth
    participant A as Auth API
    participant DB as Database

    U->>F: Click "Continue with Google"
    F->>G: Redirect to Google
    U->>G: Authorize app
    G->>A: Return authorization code
    A->>G: Exchange code for tokens
    G-->>A: Return user profile
    A->>DB: Create/update user
    A->>A: Create JWT session
    A-->>F: Redirect with session
```

## Security Best Practices Implemented

### 1. Password Security

- **bcrypt hashing** with 12 salt rounds
- **Strong password requirements** enforced
- **No plaintext storage** ever

### 2. Session Security

- **JWT tokens** with secure signing
- **Automatic expiry** (24 hours max age)
- **Inactivity timeout** (4 hours max)
- **Activity tracking** on every request

### 3. Route Protection

- **Middleware-level protection** before React renders
- **Server-side validation** for API routes
- **Graceful redirects** with callback URLs

### 4. CSRF Protection

- **NextAuth built-in CSRF** protection
- **Secure cookie attributes** (httpOnly, secure, sameSite)
- **Token verification** on state-changing operations

### 5. Input Validation

- **Client-side validation** for immediate feedback
- **Server-side validation** for security
- **Type safety** with TypeScript

## Authorization Implementation Details

### User Roles and Permissions

```mermaid
graph TB
    subgraph "Role Hierarchy"
        A[User] --> B[Basic Features]
        C[Premium] --> D[Advanced Features]
        C --> B
        E[Admin] --> F[Management Features]
        E --> D
        E --> B
    end

    subgraph "Role Capabilities"
        B --> G[Dashboard Access]
        B --> H[Profile Management]
        B --> I[Basic Trading]

        D --> J[Solar System View]
        D --> K[Advanced Analytics]
        D --> L[Premium Features]

        F --> M[User Management]
        F --> N[System Administration]
        F --> O[All Features]
    end
```

### Authorization Components Usage

```typescript
// Route-level protection
export default withPageAuth(DashboardPage, {
  requiredRoles: ["user", "admin", "premium"],
  redirectTo: "/auth/login"
});

// Component-level protection
<AuthGuard requiredRoles={["premium", "admin"]}>
  <PremiumFeature />
</AuthGuard>

// Conditional rendering
<ConditionalRender requiredRoles={["admin"]}>
  <AdminPanel />
</ConditionalRender>

// Hook-based authorization
const { hasPermission, role } = useAuth();
if (hasPermission(["premium", "admin"])) {
  // Show premium content
}
```

### API Route Authorization Flow

```mermaid
flowchart TD
    A[API Request] --> B[requireAuth Middleware]
    B --> C{User Authenticated?}
    C -->|No| D[Return 401 Unauthorized]
    C -->|Yes| E[Extract User Role]
    E --> F{Role Authorized?}
    F -->|No| G[Return 401 Insufficient Permissions]
    F -->|Yes| H[Process Request]
    H --> I[Return Response]
```

This architecture provides a robust, scalable authentication and authorization system with multiple layers of security, role-based access control, and excellent user experience through automatic session management and seamless provider integration.
