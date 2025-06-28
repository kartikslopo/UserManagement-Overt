# User Management System - Overt Solutions Assignment

A full-stack user management application with role-based access control, multilingual support (English/Arabic), and comprehensive CRUD operations.
Video Demo : -https://drive.google.com/file/d/1qkbClUjAEViZja_33xVFFSxRBZiAsmEn/view?usp=sharing

## 🌟 Features

### **Core Functionality**
- **User Authentication & Authorization** - JWT-based authentication with role-based access control
- **Role-Based Dashboards** - Different interfaces for Admin, Viewer, and User roles
- **CRUD Operations** - Complete user management (Create, Read, Update, Delete) for Admin users
- **User Profile Management** - Users can view their own profile information
- **Search & Pagination** - Server-side search and pagination for large user lists
- **Sorting** - Multi-column sorting capabilities

### **Internationalization**
- **Multilingual UI** - Full support for English and Arabic languages
- **RTL Support** - Right-to-left layout support for Arabic
- **Language Switching** - Dynamic language switching without page reload
- **Localized Content** - All UI elements, buttons, messages, and forms are translated

### **Security & Monitoring**
- **JWT Authentication** - Secure token-based authentication
- **Role-based Authorization** - Granular permission system
- **Global Exception Handling** - Comprehensive error handling and user-friendly error messages
- **Extensive Logging** - Detailed logging for debugging and monitoring
- **Request Auditing** - All user actions are logged for security auditing

### **Technical Features**
- **Responsive Design** - Mobile-friendly Material-UI components
- **Error Boundaries** - Graceful error handling in React
- **Protected Routes** - Route-level security
- **Modern Architecture** - Clean separation of concerns

## 🏗️ Architecture

### **Backend (.NET 8)**
- **ASP.NET Core Web API** - RESTful API with OpenAPI documentation
- **Entity Framework Core** - Data access with repository pattern
- **JWT Authentication** - Secure token-based authentication
- **Serilog** - Structured logging with file and console output
- **Dapper** - High-performance data access
- **BCrypt** - Secure password hashing

### **Frontend (React)**
- **React 18** - Modern React with hooks
- **Material-UI (MUI)** - Professional UI components
- **React Router** - Client-side routing
- **React i18next** - Internationalization framework
- **Vite** - Fast development and build tool

### **Database**
- **SQL Server** - Relational database for user data storage

## 🚀 Getting Started

### **Prerequisites**

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **SQL Server** (LocalDB or Full) - [Download](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- **Visual Studio 2022** or **VS Code** (recommended)

### **Installation & Setup**

#### **1. Clone the Repository**
```bash
git clone <repository-url>
cd UserManagement
```

#### **2. Database Setup**

1. **Ensure SQL Server is running**
2. **Update Connection String** (if needed):
   - Open `UserManagement/UserManagement/appsettings.json`
   - Modify the connection string if your SQL Server setup differs:
   ```json
   {
     "ConnectionStrings": {
       "Default": "Server=(localdb)\\mssqllocaldb;Database=UserManagementDB;Trusted_Connection=true;TrustServerCertificate=true;"
     }
   }
   ```

3. **Create Database Schema**:
   Execute the following SQL script in your SQL Server:
   ```sql
   CREATE DATABASE UserManagementDB;
   GO

   USE UserManagementDB;
   GO

   CREATE TABLE Users (
       Id INT IDENTITY(1,1) PRIMARY KEY,
       Username NVARCHAR(255) UNIQUE NOT NULL,
       PasswordHash NVARCHAR(MAX) NOT NULL,
       Role NVARCHAR(50) NOT NULL,
       Name NVARCHAR(255) NOT NULL,
       Description NVARCHAR(MAX)
   );
   ```

#### **3. Backend Setup**

1. **Navigate to the backend directory**:
   ```bash
   cd UserManagement/UserManagement
   ```

2. **Restore NuGet packages**:
   ```bash
   dotnet restore
   ```

3. **Build the project**:
   ```bash
   dotnet build
   ```

4. **Run the backend**:
   ```bash
   dotnet run
   ```

   The API will start at `https://localhost:7221` and `http://localhost:5221`

#### **4. Frontend Setup**

1. **Navigate to the frontend directory**:
   ```bash
   cd usermanagement.ui
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

   The frontend will start at `http://localhost:5173`

### **Default Admin Account**

The system automatically creates a default admin account on first run:

- **Username**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Admin

## 🎯 User Roles & Permissions

### **Admin**
- ✅ View all users
- ✅ Create new users
- ✅ Edit existing users
- ✅ Delete users
- ✅ Access admin dashboard
- ✅ View own profile

### **Viewer**
- ✅ View all users (read-only)
- ✅ Access viewer dashboard
- ✅ View own profile
- ❌ Cannot create, edit, or delete users

### **User**
- ✅ View own profile only
- ✅ Access user dashboard
- ❌ Cannot view other users
- ❌ Cannot perform CRUD operations

## 🌐 API Endpoints

### **Authentication**
```
POST /api/user/login          # User login
```

### **User Management**
```
GET    /api/user              # Get all users (Admin, Viewer)
GET    /api/user/paginated    # Get paginated users (Admin, Viewer)
GET    /api/user/me           # Get current user profile (All)
POST   /api/user              # Create new user (Admin only)
PUT    /api/user/{id}         # Update user (Admin only)
DELETE /api/user/{id}         # Delete user (Admin only)
```

### **API Documentation**
When running in development mode, Swagger documentation is available at:
- `https://localhost:7221/swagger`

## 🌍 Internationalization

The application supports full internationalization with the following features:

### **Supported Languages**
- **English** (default)
- **Arabic** (with RTL support)

### **Translation Coverage**
- Navigation menus
- Form labels and placeholders
- Button text
- Error messages
- Status indicators
- Role names
- Dashboard headers
- Dialog boxes

### **Language Switching**
Users can switch languages using the language switcher component available on:
- Login page
- All dashboard pages
- The language preference persists across sessions

## 🔧 Configuration

### **Backend Configuration**

**JWT Settings** (`appsettings.json`):
```json
{
  "Jwt": {
    "Key": "your-secret-key-here"
  }
}
```

**CORS Settings** - The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:5173`
- `https://localhost:5173`
- `http://localhost:7221`
- `https://localhost:7221`

### **Frontend Configuration**

**API Configuration** (`src/config/config.js`):
```javascript
const config = {
  API_BASE_URL: 'https://localhost:7221/api'
};
```

## 📊 Logging & Monitoring

### **Log Levels**
- **Information**: General application flow
- **Warning**: Unexpected situations that don't break the app
- **Error**: Exceptions and error conditions
- **Debug**: Detailed diagnostic information

### **Log Outputs**
- **Console**: Development debugging
- **Files**: `logs/userManagement-YYYY-MM-DD.log` (7-day retention)

### **Logged Events**
- User authentication attempts
- CRUD operations
- Database queries
- API requests/responses
- Application errors
- Performance metrics

## 🛠️ Development

### **Project Structure**

```
UserManagement/
├── UserManagement/                 # Backend (.NET)
│   ├── Controllers/               # API controllers
│   ├── Data/                     # Data access layer
│   ├── Services/                 # Business logic services
│   ├── Models/                   # Data models
│   ├── Filters/                  # Global filters
│   └── Program.cs               # Application entry point
├── usermanagement.ui/            # Frontend (React)
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── contexts/            # React contexts
│   │   ├── services/            # API services
│   │   ├── i18n/               # Internationalization
│   │   └── sign-in-side/       # Authentication components
│   ├── public/                 # Static assets
│   └── package.json           # Frontend dependencies
└── README.md                  # This file
```

## 🔒 Security Considerations

- **Passwords**: All passwords are hashed using BCrypt
- **JWT Tokens**: Expire after 2 hours
- **Authorization**: Role-based access control on all endpoints
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection**: Prevented using parameterized queries
- **XSS Protection**: Material-UI components provide built-in protection

## 📈 Performance

- **Pagination**: Server-side pagination for large datasets
- **Lazy Loading**: Components load only when needed
- **Caching**: JWT tokens cached in localStorage
- **Optimized Queries**: Database queries optimized for performance
- **Bundle Splitting**: Vite automatically splits bundles for faster loading



**Environment Variables**:
- Set `ASPNETCORE_ENVIRONMENT=Production`
- Configure production database connection string
- Set secure JWT key
- Configure CORS for production domains

---

