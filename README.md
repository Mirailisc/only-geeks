# Only Geeks

Blogs & Portfolio website only for geeks 👨‍💻

## Development

### Pre-requisites

- [NodeJS](https://nodejs.org/en)
- [PNPM](https://pnpm.io/)
- [Docker (with Docker Compose)](https://www.docker.com/)

> I assumed you already have and can use git.

### Environments

Create `.env` file in the root directory of the repository.

Copy the following content into the `.env` file. (and modify it if you want)

```env
POSTGRES_USER="admin"
POSTGRES_PASSWORD="adminOnlyGeek"

DATABASE_URL="postgresql://admin:adminOnlyGeek@localhost:5432/ongeki"

BACKEND_URL=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
JWT_SECRET=""
```

### Setup

1. Clone this repository.
2. Run `docker compose up -d db` to start the database.
3. Run `pnpm install` to install dependencies.
4. Run `pnpm prisma:generate` to generate prisma client.
5. Run `pnpm prisma:migrate` to apply schema changes to the database. (if you don't have schemas, run `pnpm prisma:push` instead)
6. Run `pnpm prisma:build` to build prisma client.
7. Run `pnpm dev` to start the server. (If you want to start specific app, run `pnpm dev:frontend` or `pnpm dev:backend`)

## Testing

To run tests, you need to open cypress app inside `apps/frontend` using `pnpm cypress:open`

To write tests, please refer to [Cypress E2E Documentation](https://docs.cypress.io/app/end-to-end-testing/testing-your-app)
