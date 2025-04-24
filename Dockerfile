FROM node:22-slim AS base


# Configure pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN  npm i -g --force corepack && corepack enable

# Set working directory
WORKDIR /app

FROM base AS builder

RUN pnpm add -g turbo@^2

COPY . .
RUN turbo prune --docker --scope=@apex/backend --scope=@apex/frontend

FROM base AS installer

ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=$SHOPIFY_API_KEY

# First install the dependencies (as they change less often)
# COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
RUN SHOPIFY_API_KEY=$SHOPIFY_API_KEY pnpm turbo run build

FROM node:22-slim AS runner

# Roboto font
RUN apt-get update && \
    apt-get install -y fontconfig

RUN apt-get update && \
    apt-get install -y zip

RUN apt-get update && \
    apt-get install -y wget

RUN apt-get update && \ 
    apt-get install -y fonts-roboto

#RUN wget "https://fonts.google.com/download?family=Roboto" -O gf.zip
#RUN unzip gf.zip
#RUN mkdir -p /usr/share/fonts/truetype/google-fonts
#RUN find $PWD/ -name "*.ttf" -exec install -m644 {} /usr/share/fonts/truetype/google-fonts/ \; || return 1
#RUN rm -f gf.zip
#RUN fc-cache -f && rm -rf /var/cache/*


# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*


# skip the chromium download when installing puppeteer.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN echo "Chrome: " && google-chrome --version

# Set working directory
WORKDIR /app

COPY --from=installer /app/web/backend/package.json .
COPY --from=installer /app/web/frontend/dist ./frontend/dist
COPY --from=installer /app/web/backend/dist ./backend/dist
COPY --from=installer /app/web/backend/node_modules ./backend/node_modules
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/packages ./packages

WORKDIR /app/backend

EXPOSE 8081

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
