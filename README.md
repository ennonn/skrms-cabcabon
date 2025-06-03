# SKRMS (Sangguniang Kabataan Records Management System)

A modern web application for managing Sangguniang Kabataan records, proposals, and youth profiles. Built with Laravel and React/TypeScript.

## Features

- 🔐 **Authentication & Authorization**
  - User registration and login
  - Role-based access control
  - Email verification
  - Password reset functionality

- 👥 **Youth Profile Management**
  - Create and manage youth profiles
  - Track profile status (pending, approved, rejected)
  - Family information management
  - Personal information tracking
  - Engagement data recording

- 📝 **Proposal Management**
  - Create and submit proposals
  - Track proposal status
  - Document attachments
  - Proposal categories
  - Approval workflow

- 📊 **Analytics & Reporting**
  - Interactive charts and graphs
  - Metrics dashboard
  - Data export functionality
  - Activity monitoring

- ⚙️ **System Settings**
  - User management
  - System configuration
  - Activity logging
  - Zapier integration
  - Appearance customization

## Tech Stack

- **Backend**
  - Laravel (PHP Framework)
  - MySQL Database
  - Laravel Sanctum for API Authentication

- **Frontend**
  - React with TypeScript
  - Inertia.js
  - TailwindCSS
  - Shadcn UI Components
  - Chart.js for visualizations

- **Development Tools**
  - Vite for asset bundling
  - ESLint for code linting
  - Prettier for code formatting
  - PHPUnit for testing

## Prerequisites

- PHP 8.1 or higher
- Node.js 16 or higher
- MySQL 8.0 or higher
- Composer
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ennonn/skrms-cabcabon.git
   cd skrms-cabcabon
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install JavaScript dependencies:
   ```bash
   npm install
   ```

4. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Configure your database in `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=skrms
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

7. Run database migrations:
   ```bash
   php artisan migrate
   ```

8. Seed the database with initial data:
   ```bash
   php artisan db:seed
   ```

9. Build assets:
   ```bash
   npm run build
   ```

10. Start the development server:
    ```bash
    php artisan serve
    ```

## Development

- Start the Vite development server:
  ```bash
  npm run dev
  ```

- Run tests:
  ```bash
  php artisan test
  ```

- Run linting:
  ```bash
  npm run lint
  ```

## Project Structure

```
├── app/                    # Laravel application code
│   ├── Http/              # Controllers, Middleware, Requests
│   │   ├── models/       # Eloquent models
│   │   ├── services/     # Business logic services
│   │   └── notifications/ # Email notifications
│   ├── resources/
│   │   ├── js/           # React/TypeScript components
│   │   │   ├── components/ # Reusable UI components
│   │   │   ├── pages/    # Page components
│   │   │   └── layouts/  # Layout components
│   │   └── views/        # Blade templates
│   ├── routes/           # Application routes
│   └── database/         # Migrations and seeders
└── tests/                # PHPUnit tests
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support, please contact the development team or create an issue in the repository. 