
# TypeScript Feed Reader Backend

Gator is a modern TypeScript-based backend service for managing RSS/Atom feeds and their posts. This project provides a robust API for creating and managing feed subscriptions and their associated posts.

## Features

- Feed management system
- Post creation and retrieval
- User-specific feed filtering
- PostgreSQL database integration using Drizzle ORM
- TypeScript for type safety and better developer experience

## Tech Stack

- **Language**: TypeScript 5.8.3
- **Database ORM**: Drizzle ORM 0.44.2
- **Database**: PostgreSQL (using `pg` 8.16.0)
- **Development Tools**: 
  - tsx 4.19.4 (for running TypeScript files)
  - drizzle-kit 0.31.1 (for database migrations)
  - vitest 3.2.2 (for testing)

## Prerequisites

- Node.js (Latest LTS version recommended)
- PostgreSQL database server
- npm package manager

## Installation

1. Clone the repository:
```
bash git clone <repository-url> cd <project-directory>
```

2. Install dependencies:
```
bash npm install
``` 

3. Set up your environment variables (create a `.env` file):
```
env DATABASE_URL=postgresql://username:password@localhost:5432/database_name
``` 

4. Run database migrations:
```
bash npm run db:migrate
``` 

## Running the Application

Start the application in development mode:
```
npm run start <command> <args>
```

Available commands:
- help
- login
- register
- reset
- users
- agg
- addfeed
- feeds
- follow
- following
- unfollow
