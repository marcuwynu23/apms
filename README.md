# APMS - Asset & Property Management System

A production-ready, full-stack asset and property management system built with Next.js, TypeScript, MongoDB, and Tailwind CSS v4.

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.9-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwind-css)

## ✨ Features

### Core Functionality
- 🏷️ **Asset Management** - Track assets with detailed information, QR codes, and status updates
- 👥 **Assignment Tracking** - Assign assets to users and departments with complete audit trails
- 🔧 **Maintenance Logs** - Schedule and track maintenance activities
- 📊 **Reports & Analytics** - Generate comprehensive reports on asset utilization and depreciation
- 🔐 **Role-Based Access Control** - Admin, Staff, and Auditor roles with different permissions

### Technical Features
- ⚡ **Next.js 15** with App Router
- 🎨 **Tailwind CSS v4** with custom design system
- 🔒 **NextAuth.js v5** for authentication
- 🗄️ **MongoDB** with Mongoose ODM
- 📱 **Responsive Design** - Mobile-first approach
- 🎭 **Glassmorphism UI** - Modern, premium design aesthetic
- 🌓 **Dark Mode Ready** - CSS variable-based theming

## 🚀 Quick Start

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

## 👤 Default User Accounts

The system automatically creates default user accounts on first database connection:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@example.com` | `admin123` |
| **Staff** | `staff@example.com` | `staff123` |
| **Auditor** | `auditor@example.com` | `auditor123` |

> ⚠️ **Important**: Change these passwords in production!

## 📁 Project Structure

```
apms/
├── src/
│   ├── app/
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── assets/         # Asset management
│   │   │   ├── assignments/    # Assignment tracking
│   │   │   └── layout.tsx      # Dashboard layout with sidebar
│   │   ├── api/                # API routes
│   │   ├── login/              # Authentication pages
│   │   ├── globals.css         # Tailwind v4 theme & components
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Public landing page
│   ├── components/             # Reusable components
│   ├── lib/
│   │   ├── db.ts              # MongoDB connection
│   │   ├── seed.ts            # Database seeder
│   │   └── utils.ts           # Utility functions
│   ├── models/                # Mongoose models
│   │   ├── User.ts
│   │   ├── Asset.ts
│   │   ├── Assignment.ts
│   │   └── Maintenance.ts
│   ├── auth.ts                # NextAuth configuration
│   ├── auth.config.ts         # Edge-compatible auth config
│   └── middleware.ts          # Route protection
├── scripts/
│   └── seed-admin.js          # Manual seeding script
└── package.json
```

## 🎨 Design System

The application uses a custom Tailwind v4 design system defined in `globals.css`:

### Color Palette
- **Primary**: Indigo 600
- **Accent**: Violet 500
- **Background**: White / Slate 50
- **Sidebar**: Slate 900

### Component Classes
- `.card` - Glassmorphism cards with shadows
- `.btn`, `.btn-primary`, `.btn-secondary` - Button styles
- `.input` - Form input styling
- `.glass` - Glassmorphism effect

## 🔐 Authentication Flow

1. **Public Landing Page** (`/`) - Accessible to everyone
2. **Login Page** (`/login`) - No sidebar, clean auth UI
3. **Protected Routes** (`/dashboard`, `/assets`, etc.) - Require authentication
4. **Auto-redirect** - Authenticated users at `/` redirect to `/dashboard`

## 🛠️ Development

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

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.7
- **Database**: MongoDB with Mongoose 8.9
- **Authentication**: NextAuth.js 5.0 (beta)
- **Styling**: Tailwind CSS 4.1
- **Icons**: Lucide React
- **Password Hashing**: bcryptjs

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Edge Runtime compatible middleware
- ✅ Environment variable protection
- ✅ Secure session management

## 🚢 Deployment

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

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue in the repository.

---

Built with ❤️ using Next.js and Tailwind CSS
