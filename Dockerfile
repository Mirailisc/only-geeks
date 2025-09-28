# --- Frontend Build ---
FROM node:24-slim AS frontend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend ./apps/frontend

RUN pnpm install --frozen-lockfile --filter frontend --workspace-root
RUN pnpm --filter frontend run build

# --- Backend Build ---
FROM node:24-slim AS backend-build

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend ./apps/backend
COPY packages/prisma ./packages/prisma
COPY .env ./

# Install ALL deps including devDependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client (dotenv-cli needed here)
RUN pnpm prisma:generate
RUN pnpm prisma:build

# Build backend
WORKDIR /app/apps/backend
RUN pnpm run build

# --- Final Runtime Stage ---
FROM node:24-alpine AS final
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

# Install only production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/prisma/package.json ./packages/prisma/package.json
RUN pnpm install --frozen-lockfile --prod

# Copy built backend and generated Prisma client
COPY --from=backend-build /app/apps/backend/dist ./apps/backend/dist
COPY --from=backend-build /app/packages/prisma/dist ./packages/prisma/dist

# Copy frontend static assets
COPY --from=frontend-build /app/apps/frontend/dist ./apps/backend/public

ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://actionUser:adminActionUser@localhost:5432/ongeki

CMD ["node", "apps/backend/dist/main"]
