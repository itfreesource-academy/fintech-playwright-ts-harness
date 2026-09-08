# Production-ready Microsoft Playwright container runner
FROM mcr.microsoft.com/playwright:v1.43.0-jammy

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy test framework and source code
COPY . .

# Default execution
ENTRYPOINT ["npx", "playwright", "test"]
CMD ["--project=chromium"]
