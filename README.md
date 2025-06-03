# SKRMS-CABCABON

*Empowering Youth Through Seamless Engagement and Management*

[![Last Commit](https://img.shields.io/github/last-commit/ennonn/skrms-cabcabon?color=blue)]()
[![Languages](https://img.shields.io/github/languages/count/ennonn/skrms-cabcabon)]()
[![Top Language](https://img.shields.io/github/languages/top/ennonn/skrms-cabcabon)]()

## Built With

[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-9561E2?style=for-the-badge&logo=inertia&logoColor=white)](https://inertiajs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-065F46?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)](https://eslint.org/)
[![Prettier](https://img.shields.io/badge/Prettier-F7BA3E?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/)
[![PHPUnit](https://img.shields.io/badge/PHPUnit-11A9F0?style=for-the-badge&logo=phpunit&logoColor=white)](https://phpunit.de/)
[![Composer](https://img.shields.io/badge/Composer-885630?style=for-the-badge&logo=composer&logoColor=white)](https://getcomposer.org/)
[![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)

## Table of Contents

*   [Overview](#overview)
*   [Features](#features)
*   [Tech Stack](#tech-stack)
*   [Prerequisites](#prerequisites)
*   [Installation](#installation)
*   [Development](#development)
*   [Project Structure](#project-structure)
*   [Contributing](#contributing)
*   [License](#license)
*   [Support](#support)

## Overview

SKRMS-CABCABON is a powerful web application designed to streamline the management of Sangguniang Kabataan records, proposals, and youth profiles. It aims to empower youth engagement and simplify administrative tasks through a seamless digital platform.

Why SKRMS-CABCABON?

This project enhances productivity and data management while providing a user-friendly experience. Key aspects include:

*   ⚡ **Modern Tech Stack:** Built with Vite, React, TypeScript, and Laravel for a fast, efficient, and robust development and user experience.
*   🌍 **Comprehensive Record Management:** Efficiently handle youth profiles, including personal, family, and engagement data.
*   ✍️ **Streamlined Proposal Process:** Facilitate proposal creation, submission, tracking, and approval with document management.
*   📈 **Insightful Analytics:** Gain valuable insights through interactive charts, metrics dashboards, and data export capabilities.
*   🛠️ **Flexible System Settings:** Easily manage users, configure system settings, monitor activity, and integrate with external services like Zapier.
*   🔒 **Secure and Role-Based Access:** Ensure data security and proper access levels through robust authentication and authorization.

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
│   ├── Models/            # Eloquent models
│   ├── Services/          # Business logic services
│   └── Notifications/     # Email notifications
├── resources/
│   ├── js/               # React/TypeScript components
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/       # Page components
│   │   └── layouts/     # Layout components
│   └── views/           # Blade templates
├── routes/               # Application routes
├── database/            # Migrations and seeders
└── tests/              # PHPUnit tests
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
