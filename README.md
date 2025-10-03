# Employee Attendance Tracker

A web application for tracking employee attendance built with Laravel 8 and React.

## Features

- **Admin Registration**: Create an organization and admin account
- **Employee Management**: Admins can add, view, activate/deactivate, and delete employees
- **Time In/Out Tracking**: Real-time attendance tracking with clock in/out functionality
- **My Shift Widget**: Interactive sidebar widget displaying:
  - Real-time clock with timezone
  - Current shift status (In Progress indicator)
  - Clock in/out times
  - Shift timebound information
  - Early time out option
- **Attendance Status Detection**:
  - **Present**: Clocked in on time
  - **Late**: Clocked in more than 15 minutes after shift start
  - **Half Day**: Worked less than half of the shift hours
  - **Absent**: No clock in record
- **Shift Management**: Each user has customizable shift times (default: 8:00 AM - 5:00 PM)
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

### Time Tracking

**For Employees:**

1. Log in to your account
2. You'll see the **My Shift** widget on the dashboard sidebar
3. Click **Time In** button to start your shift
   - The system will record your clock-in time
   - Status will be automatically determined (Present/Late)
   - "In Progress" badge will appear
4. During your shift, you can:
   - View current time and timezone
   - See your clock-in time and status
   - Use **Time Out Early** button if needed
5. Click **Time Out** when your shift ends
   - The system calculates if you completed your shift
   - Status may update to Half Day if you left early

**Attendance Status:**
- **Present**: Clocked in within 15 minutes of shift start
- **Late**: Clocked in more than 15 minutes after shift start
- **Half Day**: Total work hours less than half of shift duration
- **Absent**: No clock-in record for the day

## Project Structure

```
employee-attendance-tracker/
├── app/
│   ├── Http/Controllers/Api/
│   │   ├── AuthController.php           # Authentication endpoints
│   │   ├── EmployeeController.php       # Employee management endpoints
│   │   └── AttendanceController.php     # ✨ Attendance tracking endpoints
│   └── Models/
│       ├── User.php                      # User model with shift times
│       ├── Organization.php              # Organization model
│       └── Attendance.php                # ✨ Attendance model with status logic
├── database/migrations/
│   ├── 2014_10_12_000000_create_users_table.php
│   ├── 2025_10_02_062139_create_organizations_table.php
│   ├── 2025_10_02_062313_add_organization_and_role_to_users_table.php
│   ├── 2025_10_03_041834_add_shift_times_to_users_table.php      # ✨ User shift times
│   └── 2025_10_03_041836_create_attendances_table.php            # ✨ Attendance records
├── resources/
│   ├── js/
│   │   ├── components/
│   │   │   ├── Layout.jsx               # Shared layout component
│   │   │   ├── ProtectedRoute.jsx       # Route protection
│   │   │   └── MyShiftWidget.jsx        # ✨ Time in/out widget
│   │   ├── context/
│   │   │   └── AuthContext.jsx          # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx                # Login page
│   │   │   ├── Register.jsx             # Registration page
│   │   │   ├── Dashboard.jsx            # Dashboard with shift widget
│   │   │   └── Employees.jsx            # Employee management page
│   │   ├── utils/
│   │   │   └── api.js                   # Axios configuration
│   │   └── app.jsx                      # React app entry point
│   ├── css/
│   │   └── app.css                      # Tailwind CSS
│   └── views/
│       └── app.blade.php                # Main HTML template
├── routes/
│   ├── web.php                          # Web routes
│   └── api.php                          # API routes (with attendance endpoints)
├── config/
│   └── app.php                          # ✨ Timezone set to Asia/Manila
├── vite.config.js                       # Vite configuration
├── tailwind.config.js                   # Tailwind configuration
└── package.json                         # Node dependencies

✨ = New/Modified files for attendance tracking feature
```

## API Endpoints

### Public Endpoints

- `POST /api/register` - Register new organization and admin
- `POST /api/login` - User login

### Protected Endpoints (require authentication)

**Authentication:**
- `POST /api/logout` - Logout current user
- `GET /api/me` - Get current user details

**Employee Management (Admin only):**
- `GET /api/employees` - List all employees
- `POST /api/employees` - Create new employee
- `PUT /api/employees/{id}` - Update employee
- `DELETE /api/employees/{id}` - Delete employee

**Attendance Tracking:**
- `GET /api/attendance/today` - Get today's attendance for current user
- `POST /api/attendance/time-in` - Clock in for the day
- `POST /api/attendance/time-out` - Clock out
- `GET /api/attendance/history` - Get attendance history for current user
- `GET /api/attendance` - Get all attendances (admin only)

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
