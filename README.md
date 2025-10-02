# Employee Attendance Tracker

A web application for tracking employee attendance built with Laravel 8 and React.

## Features

- **Admin Registration**: Create an organization and admin account
- **Employee Management**: Admins can add, view, activate/deactivate, and delete employees
- **Organization-based**: Multi-tenant system where each organization has its own employees
- **Authentication**: Secure JWT-based authentication using Laravel Sanctum
- **Role-based Access**: Admin and Employee roles with different permissions

## Tech Stack

### Backend
- Laravel 8.x
- PostgreSQL
- Laravel Sanctum (API authentication)

### Frontend
- React 18
- React Router DOM
- Axios
- Tailwind CSS
- Vite

## Prerequisites

- PHP >= 7.3
- Composer
- Node.js >= 14.x
- npm or yarn
- PostgreSQL (or Docker with PostgreSQL)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd employee-attendance-tracker
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Configuration

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Update the following environment variables in `.env`:

```env
APP_NAME="Employee Attendance Tracker"
APP_URL=http://localhost

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=employeetracker
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
```

### 5. Generate Application Key

```bash
php artisan key:generate
```

### 6. Set Up Database

**Option A: Using Docker (recommended)**

Start PostgreSQL using Docker:

```bash
docker run --name postgres-attendance -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=employeetracker -p 5432:5432 -d postgres:14
```

**Option B: Local PostgreSQL**

Create a database named `employeetracker` using your PostgreSQL client or command line:

```sql
CREATE DATABASE employeetracker;
```

### 7. Run Database Migrations

```bash
php artisan migrate
```

### 8. Start Development Servers

You need to run **both** servers in separate terminal windows:

**Terminal 1 - Laravel Backend:**
```bash
php artisan serve
```
This will start the Laravel server at `http://127.0.0.1:8000`

**Terminal 2 - Vite Frontend:**
```bash
npm run dev
```
This will start the Vite dev server at `http://127.0.0.1:5173`

### 9. Access the Application

Open your browser and navigate to:
```
http://127.0.0.1:8000
```

## Usage

### Creating an Admin Account

1. Navigate to the registration page
2. Fill in the form:
   - Organization Name
   - Organization Code (unique identifier)
   - Your Name
   - Email
   - Password
3. Click "Create Account"
4. You'll be automatically logged in as an admin

### Adding Employees

1. Log in as an admin
2. Click on "Employees" in the navigation bar
3. Click "Add Employee" button
4. Fill in employee details:
   - Name
   - Email
   - Password
5. Click "Create Employee"

Employees will be automatically assigned to your organization.

### Employee Login

Employees can log in using the email and password created by the admin.

## Project Structure

```
employee-attendance-tracker/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── AuthController.php       # Authentication endpoints
│   │   └── EmployeeController.php   # Employee management endpoints
│   └── Models/
│       ├── User.php                  # User model
│       └── Organization.php          # Organization model
├── database/migrations/              # Database migrations
├── resources/
│   ├── js/
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Shared layout component
│   │   │   └── ProtectedRoute.jsx   # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── Register.jsx         # Registration page
│   │   │   ├── Dashboard.jsx        # Dashboard page
│   │   │   └── Employees.jsx        # Employee management page
│   │   ├── utils/
│   │   │   └── api.js               # Axios configuration
│   │   └── app.jsx                  # React app entry point
│   ├── css/
│   │   └── app.css                  # Tailwind CSS
│   └── views/
│       └── app.blade.php            # Main HTML template
├── routes/
│   ├── web.php                      # Web routes
│   └── api.php                      # API routes
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
└── package.json                     # Node dependencies
```

## API Endpoints

### Public Endpoints

- `POST /api/register` - Register new organization and admin
- `POST /api/login` - User login

### Protected Endpoints (require authentication)

- `POST /api/logout` - Logout current user
- `GET /api/me` - Get current user details
- `GET /api/employees` - List all employees (admin only)
- `POST /api/employees` - Create new employee (admin only)
- `PUT /api/employees/{id}` - Update employee (admin only)
- `DELETE /api/employees/{id}` - Delete employee (admin only)

## Development

### Building for Production

```bash
npm run build
```

This will compile assets for production in the `public/build` directory.

### Running Tests

```bash
php artisan test
```

## Troubleshooting

### White Screen Issue

If you see a blank white screen:
1. Check browser console for JavaScript errors (F12)
2. Ensure both `php artisan serve` and `npm run dev` are running
3. Hard refresh the browser (Ctrl+Shift+R)

### Database Connection Error

If you get "Connection refused" errors:
1. Ensure PostgreSQL is running
2. Check database credentials in `.env`
3. Test database connection: `php artisan migrate:status`

### Port Already in Use

If port 8000 or 5173 is already in use:
- For Laravel: `php artisan serve --port=8001`
- For Vite: Update `vite.config.js` to use a different port

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open-source and available under the MIT License.
