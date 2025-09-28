# --- Frontend Build ---
FROM node:24-slim AS frontend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend ./apps/frontend

RUN pnpm install --frozen-lockfile --filter frontend --workspace-root --prod
RUN pnpm --filter frontend run build

# --- Backend Build ---
FROM node:24-slim AS backend-build

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend ./apps/backend
COPY packages/prisma ./packages/prisma

RUN pnpm install --frozen-lockfile --prod
RUN pnpm prisma:generate
RUN pnpm prisma:build

WORKDIR /app/apps/backend
RUN pnpm run build

# --- Final Runtime Stage ---
FROM node:24-slim AS final

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates unzip openssl libssl-dev pkg-config && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.0.0 --activate

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
COPY packages/prisma/package.json ./packages/prisma/package.json
COPY packages/prisma/prisma ./packages/prisma/prisma

# Copy built backend and frontend
COPY --from=backend-build /app/apps/backend/dist ./apps/backend/dist
COPY --from=frontend-build /app/apps/frontend/dist ./apps/backend/public
COPY --from=backend-build /app/packages/prisma/dist ./packages/prisma/dist

RUN pnpm install --frozen-lockfile --prod
RUN pnpm prisma:generate

ENV NODE_ENV=production

CMD ["node", "apps/backend/dist/main"]