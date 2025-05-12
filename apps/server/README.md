# Server

## Getting Started

### Installation

Install the dependencies:

```bash
pnpm install
```

### Configure Environment Variables

Copy the example environment file to create your local configuration:

```bash
pnpm config:local
```

### Development

Start the development server with hot reload:

```bash
pnpm dev
```

Your server will be running and automatically restart when changes are detected.

## Database Seeding

Populate the database with initial data:

```bash
# Seed all data
pnpm db:seed

# Or seed specific data sets
pnpm db:seed:user
pnpm db:seed:transaction
```

## Testing

Run tests:

```bash
# Run all tests
pnpm test

# Run with watch mode
pnpm test:watch

# Run with coverage report
pnpm test:coverage
```

## Building for Production

Create a production build:

```bash
pnpm build
```

## Deployment

Start the production server:

```bash
pnpm start
```

## Tech Stack

- Node.js with TypeScript
- GraphQL API with Relay
- MongoDB with Mongoose
- Koa web framework
- JWT authentication
