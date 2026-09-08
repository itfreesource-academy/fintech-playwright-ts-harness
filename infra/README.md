# FinTech Playwright & Browser Test Infrastructure (IaC)

This directory contains containerized infrastructure blueprints for executing headless, cross-browser Playwright E2E suites against isolated local portal servers.

---

## 🏛️ Architecture Stack

1. **Target WebApp Gateway (`web-portal` - Port 3000):**
   * NGINX Alpine container hosting the FinTech Payment Portal static assets locally, decoupling test execution from Cloudflare edge latency.
2. **Containerized Playwright Runner (`playwright-runner`):**
   * Microsoft Playwright container (`v1.43.0-jammy`) executing tests across Chromium, Firefox, and WebKit in parallel.
3. **HTML Report Dashboard Server (`report-server` - Port 9323):**
   * NGINX Alpine container serving the generated `playwright-report/` for instant post-run visual auditing in any browser.

---

## 🚀 Running Local Test Infrastructure

```bash
# 1. Spin up the target web portal and run containerized Playwright tests
docker compose -f infra/docker-compose.infra.yml up --build --abort-on-container-exit playwright-runner

# 2. Start the interactive report server
docker compose -f infra/docker-compose.infra.yml up -d report-server
open http://localhost:9323

# 3. Clean up infrastructure
docker compose -f infra/docker-compose.infra.yml down -v
```
