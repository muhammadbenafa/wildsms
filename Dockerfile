# ── Stage 1: deps ────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install production deps only
RUN npm install --omit=dev

# ── Stage 2: final image ──────────────────────────────────────────────────────
FROM node:20-alpine AS runner

LABEL maintainer="WildSMS"
LABEL description="Wildlife awareness platform — Africa's Talking SMS API"
LABEL version="1.0.0"

WORKDIR /app

# Create non-root user for security
RUN addgroup -S wildsms && adduser -S wildsms -G wildsms

# Copy deps from stage 1
COPY --from=deps /app/node_modules ./node_modules

# Copy source
COPY --chown=wildsms:wildsms . .

# Remove .env from the image — secrets come in via env vars at runtime
RUN rm -f .env

# Switch to non-root
USER wildsms

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["node", "server.js"]
