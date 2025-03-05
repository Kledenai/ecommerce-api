# Ecommerce API

A scalable and high-performance e-commerce API built with NestJS, TypeScript, and PostgreSQL. Designed for modularity, security, and efficiency, featuring JWT authentication and Prisma ORM.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
  - [Running Tests](#running-tests)
- [License](#license)

## Features

- Product & category management
- User authentication & role-based access (JWT, OAuth)
- Shopping cart & checkout (multi-payment support)
- Order tracking & real-time notifications
- Inventory management & webhook integrations

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeScript**: A statically typed superset of JavaScript.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Prisma ORM**: Next-generation ORM for Node.js and TypeScript.
- **JWT**: JSON Web Tokens for secure authentication.
- **Docker**: Containerization platform for consistent development and deployment environments.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) (optional, for containerized PostgreSQL setup)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Kledenai/ecommerce-api.git
   cd ecommerce-api
   ```

2. **Install dependencies:**

   Using npm:

   ```bash
   npm install
   ```

   Or using yarn:

   ```bash
   yarn install
   ```

### Database Setup

The application requires a PostgreSQL database. You can set it up in two ways:

1. **Using Docker (Recommended):**

   Utilize the [docker-postgres](https://github.com/Kledenai/docker-postgres) repository to quickly set up a PostgreSQL instance using Docker.

   - **Clone the docker-postgres repository:**

     ```bash
     git clone https://github.com/Kledenai/docker-postgres.git
     cd docker-postgres
     ```

   - **Start the PostgreSQL container:**

     ```bash
     docker-compose up -d
     ```

   This will set up a PostgreSQL database accessible at `localhost:5432`.

2. **Manual Setup:**

   Alternatively, install PostgreSQL manually on your system and create a new database.

### Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>?schema=public"
JWT_SECRET="<your_jwt_secret>"
APP_URL="http://localhost:3000"
```

Replace `<username>`, `<password>`, and `<database_name>` with your PostgreSQL credentials and desired database name.

### Running the Application

1. **Generate Prisma client:**

   ```bash
   npx prisma generate
   ```

2. **Apply database migrations:**

   ```bash
   npx prisma migrate deploy
   ```

3. **Start the application:**

   Using npm:

   ```bash
   npm run start:dev
   ```

   Or using yarn:

   ```bash
   yarn start:dev
   ```

   The API will be running at `http://localhost:3000`.

### Running Tests

To execute the test suite:

Using npm:

```bash
npm run test
```

Or using yarn:

```bash
yarn test
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
