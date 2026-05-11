<div align="center">

# apms

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.9-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwind-css)

</div>

A production-ready, full-stack asset and property management system built with Next.js, TypeScript, MongoDB, and Tailwind CSS v4.

## Features

### Core Functionality

- **Asset Management** - Track assets with detailed information, QR codes, and status updates
- **Assignment Tracking** - Assign assets to users and departments with complete audit trails
- **Maintenance Logs** - Schedule and track maintenance activities
- **Reports & Analytics** - Generate comprehensive reports on asset utilization and depreciation
- **Role-Based Access Control** - Admin, Staff, and Auditor roles with different permissions

### Technical Features

- **Next.js 15** with App Router
- **Tailwind CSS v4** with custom design system
- **NextAuth.js v5** for authentication
- **MongoDB** with Mongoose ODM
- **Responsive Design** - Mobile-first approach
- **Glassmorphism UI** - Modern, premium design aesthetic
- **Dark Mode Ready** - CSS variable-based theming

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd apms
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=mongodb://localhost:27017/apms
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/apms

   AUTH_SECRET=your-secret-key-here
   # Generate with: openssl rand -base64 32
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Default User Accounts

The system automatically creates default user accounts on first database connection:

| Role        | Email                 | Password     |
| ----------- | --------------------- | ------------ |
| **Admin**   | `admin@example.com`   | `admin123`   |
| **Staff**   | `staff@example.com`   | `staff123`   |
| **Auditor** | `auditor@example.com` | `auditor123` |

> ⚠️ **Important**: Change these passwords in production!

## Process Diagrams

### Asset Management Workflow

This diagram illustrates the complete lifecycle of assets in the APMS system, from initial creation to ongoing management. Assets begin with detailed registration including photos and documentation, then become available for assignment or maintenance scheduling. The system supports flexible assignment types (users, departments, or external entities) with comprehensive status tracking and automatic inventory management upon return.

```mermaid
graph TD
    A[Create Asset] --> B[Set Asset Details]
    B --> C[Upload Photos/Documents]
    C --> D[Set Quantity & Location]
    D --> E[Asset Available]

    E --> F[Assign Asset]
    E --> G[Schedule Maintenance]
    E --> H[Update Asset Info]

    F --> I[Select Assignee Type]
    I --> J[User Assignment]
    I --> K[Department Assignment]
    I --> L[External Assignment]

    J --> M[Track Assignment Status]
    K --> M
    L --> M

    M --> N[Active]
    M --> O[Returned]
    M --> P[Overdue]
    M --> Q[Lost]

    O --> R[Update Asset Condition]
    R --> S[Restore Inventory]
    S --> E
```

### User Authentication & Access Control

This diagram shows the security framework of the APMS system, demonstrating how users authenticate and gain role-based access to different system features. The system implements three distinct user roles with varying permission levels: Admins have full system access, Staff can manage assets with limitations, and Auditors have read-only access for compliance and reporting purposes.

```mermaid
graph TD
    A[User Login] --> B[Validate Credentials]
    B --> C{Valid?}
    C -->|No| D[Login Failed]
    C -->|Yes| E[Create Session]

    E --> F[Check User Role]
    F --> G[Admin Access]
    F --> H[Staff Access]
    F --> I[Auditor Access]

    G --> J[Full System Access]
    H --> K[Limited Asset Management]
    I --> L[Read-Only Reports]

    J --> M[Dashboard]
    K --> M
    L --> M

    M --> N[Route Protection]
    N --> O{Authorized?}
    O -->|Yes| P[Access Granted]
    O -->|No| Q[Redirect to Login]
```

### Assignment Process Flow

This diagram details the asset assignment workflow, showing how assets are allocated to users, departments, or external parties. The process includes comprehensive documentation with condition assessments and photo evidence at both assignment and return stages. The system automatically manages inventory quantities and tracks assignment status with overdue monitoring and automated notifications.

```mermaid
graph TD
    A[Select Asset] --> B{Available?}
    B -->|No| C[Asset Unavailable]
    B -->|Yes| D[Choose Assignee]

    D --> E[Set Assignment Details]
    E --> F[Document Condition]
    F --> G[Take Photos]
    G --> H[Set Return Date]
    H --> I[Create Assignment]

    I --> J[Update Asset Quantity]
    J --> K[Assignment Active]

    K --> L[Monitor Status]
    L --> M{Due Date?}
    M -->|Overdue| N[Mark Overdue]
    M -->|On Time| O[Continue Tracking]

    K --> P[Return Process]
    P --> Q[Document Return Condition]
    Q --> R[Take Return Photos]
    R --> S[Update Assignment Status]
    S --> T[Restore Asset Quantity]
```

### Maintenance Workflow

This diagram outlines the maintenance management process, supporting four types of maintenance activities: repairs, routine maintenance, damage assessment, and inspections. The workflow includes technician assignment, status progression tracking, cost recording, and scheduling of future maintenance activities. All maintenance activities are documented with photos and linked to asset condition updates.

```mermaid
graph TD
    A[Asset Needs Maintenance] --> B[Create Maintenance Record]
    B --> C[Set Maintenance Type]
    C --> D[Repair]
    C --> E[Maintenance]
    C --> F[Damage]
    C --> G[Inspection]

    D --> H[Assign Technician]
    E --> H
    F --> H
    G --> H

    H --> I[Set Status: Pending]
    I --> J[Begin Work]
    J --> K[Status: In Progress]
    K --> L[Complete Work]
    L --> M[Status: Completed]

    M --> N[Record Cost]
    N --> O[Upload Photos]
    O --> P[Schedule Next Checkup]
    P --> Q[Update Asset Condition]
    Q --> R[Asset Available]
```

## Authentication Flow

1. **Public Landing Page** (`/`) - Accessible to everyone
2. **Login Page** (`/login`) - No sidebar, clean auth UI
3. **Protected Routes** (`/dashboard`, `/assets`, etc.) - Require authentication
4. **Auto-redirect** - Authenticated users at `/` redirect to `/dashboard`

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Manual database seeding
node scripts/seed-admin.js
```

### Adding New Features

1. **Models** - Add Mongoose schemas in `src/models/`
2. **API Routes** - Create endpoints in `src/app/api/`
3. **Pages** - Add pages in `src/app/(dashboard)/` for protected routes
4. **Components** - Create reusable components in `src/components/`

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Database**: MongoDB with Mongoose 8.9
- **Authentication**: NextAuth.js 5.0 (beta)
- **Styling**: Tailwind CSS 4.1
- **Icons**: Lucide React
- **Password Hashing**: bcryptjs

## Security Features

- Password hashing with bcrypt
- Role-based access control (RBAC)
- Edge Runtime compatible middleware
- Environment variable protection
- Secure session management

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```env
MONGODB_URI=your-production-mongodb-uri
AUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://yourdomain.com
```

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue in the repository.
