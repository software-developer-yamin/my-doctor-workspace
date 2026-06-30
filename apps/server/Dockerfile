# Stage 1 — dependencies
FROM node:24-alpine AS deps
RUN corepack enable && corepack prepare pnpm@10.9.0 --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY packages/types/package.json ./packages/types/
COPY packages/utils/package.json ./packages/utils/
COPY packages/config/package.json ./packages/config/
RUN pnpm install --frozen-lockfile --filter my-doctor-backend...

# Stage 2 — build
FROM node:24-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.9.0 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/server/node_modules ./apps/server/node_modules
COPY apps/server ./apps/server
COPY packages ./packages
WORKDIR /app/apps/server
RUN pnpm run build

# Stage 3 — production runtime
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@10.9.0 --activate

COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json
RUN pnpm install --prod --frozen-lockfile

EXPOSE 6089

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:6089/api/health || exit 1

USER node
CMD ["node", "dist/app.js"]
