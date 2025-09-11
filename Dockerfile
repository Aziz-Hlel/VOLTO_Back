FROM node:22.14.0-alpine

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./


RUN pnpm install --frozen-lockfile


COPY . .

RUN  pnpm prisma generate


# RUN pnpm run seed


CMD ["pnpm", "run", "start:dev"] 