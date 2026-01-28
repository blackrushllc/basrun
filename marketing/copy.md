# BASRUN.COM Marketing Copy

## 1. Hero
**Headline:** Run your code, not your servers.
**Subhead:** BASRUN is the dedicated cloud runtime for Basil. Deploy scheduled jobs, webhooks, and REST APIs in seconds with zero infrastructure overhead.
**Bullets:**
- Reliable Scheduled Jobs (Cron)
- Instant Webhook Handlers
- Production-Ready REST APIs
**Primary CTA:** Get started free
**Secondary CTA:** Read the docs

**Basil Snippet (Health Check):**
```basil
REM Health Check and Email Alert Example
REM Tries to access a health status URL and sends an email if it fails.
REM Requires basil-objects-net feature.

REM Load environment variables from .env if it exists
LET ok% = LOADENV%(".env")

LET healthUrl$ = ENV$("HEALTH_URL")
LET smtpHost$ = ENV$("SMTP_HOST")
LET smtpUser$ = ENV$("SMTP_USER")
LET smtpPass$ = ENV$("SMTP_PASS")
LET alertEmail$ = ENV$("ALERT_EMAIL")

IF healthUrl$ = "" THEN
    PRINT "Error: HEALTH_URL environment variable not set."
    STOP
END IF

REM Handle port with default
LET smtpPortStr$ = ENV$("SMTP_PORT")
LET smtpPort% = 587
IF smtpPortStr$ <> "" THEN LET smtpPort% = EVAL(smtpPortStr$)

REM Handle TLS mode with default
LET smtpTls$ = ENV$("SMTP_TLS")
IF smtpTls$ = "" THEN LET smtpTls$ = "starttls"

PRINT "Checking health of: "; healthUrl$

LET http@ = NEW HTTP()
TRY
    LET response$ = http@.Get$(healthUrl$)
    LET status% = http@.LastStatus%
    
    IF status% >= 200 AND status% < 300 THEN
        PRINT "Health check successful. Status: "; status%
    ELSE
        PRINT "Health check failed! Status: "; status%
        GOSUB SendAlert
    END IF
CATCH e$
    PRINT "Health check failed with error: "; e$
    LET status% = 0
    GOSUB SendAlert
END TRY

END

LABEL SendAlert
    PRINT "Sending alert email to: "; alertEmail$
    
    TRY
        LET smtp@ = NEW MAIL_SMTP(smtpHost$, smtpUser$, smtpPass$, smtpPort%, smtpTls$)
        LET subject$ = "CRITICAL: Health Check Failed for " + healthUrl$
        LET body$ = "The health check for " + healthUrl$ + " failed at " + NOW$() + "."
        IF status% <> 0 THEN
            LET body$ = body$ + " HTTP Status: " + (status% + "")
        ELSE
            LET body$ = body$ + " Error: " + e$
        END IF
        
        smtp@.SendEmail(alertEmail$, subject$, body$)
        PRINT "Alert email sent."
    CATCH mailErr$
        PRINT "Failed to send alert email: "; mailErr$
    END TRY
RETURN



```

## 2. How It Works
1. **Package & Upload:** Upload a single `.basil` file, a ZIP package with your libraries, or connect your GitHub repository (coming soon).
2. **Configure Run Mode:** Choose between Cron schedules, Webhook triggers, or REST endpoints. Set environment variables and secrets in the dashboard.
3. **Observe, Iterate, and Deploy:** Watch real-time logs, track token usage, and iterate in a safe sandbox before promoting to production.

## 3. Use Cases
- **Daily S3 Ingest:** Automatically process new files from S3 every morning at 5AM UTC.
- **5-Minute Health Check:** Monitor critical endpoints around the clock and trigger alerts instantly.
- **Stripe Webhook Handler:** Securely process payment events and synchronize your database in real-time.
- **Inventory Sync:** Keep your e-commerce platform and warehouse in sync with lightweight, scheduled scripts.
- **Lightweight REST API:** Build and expose functional endpoints for your apps without the boilerplate.
- **Scheduled Report Generator:** Aggregate weekly data and distribute reports to your team via email or Slack.

## 4. Modes
- **Scheduled (Cron):** Run logic on a recurring schedule.
  - *Example:* Cleanup script every Sunday at midnight (0 0 * * 0).
  - *Internal Mapping:* `0 0 * * 0` → `main.basil`
- **Webhooks (GET/POST):** Trigger packages via external HTTP events.
  - *Example:* Process incoming Stripe payment notifications.
  - *Internal Mapping:* `POST /hooks/stripe` → `webhook.basil`
- **REST APIs:** Expose packages as fully-functional REST endpoints.
  - *Example:* Fetch real-time system status.
  - *Internal Mapping:* `GET /status/123` → `STATUS(123)`

## 5. Dashboard Preview
**Complete Visibility:** A developer-first dashboard for monitoring and iteration.
- Package management and versioning.
- Real-time execution logs and audit trails.
- Next run countdowns for scheduled jobs.
- Token usage and error rate analytics.
- Interactive sandbox for testing snippets.

## 6. Safety & Trust
- **Sandboxed Runtime:** Every execution happens in an isolated container for maximum security.
- **Secrets Management:** Inject API keys and credentials safely via environment variables.
- **Rate Limiting:** Protect your endpoints with built-in, configurable limits.
- **Audit Trails:** Comprehensive logs of every run, change, and deployment.

## 7. Pricing
- **Free Tier:** Start for free with basic features.
- **Trial Tier:** Experience the full power of BASRUN for 14 days.
- **Production Usage:** Token-based pricing—pay only for the execution time you use.

## 8. Final CTA
**Headline:** Ready to run Basil in the cloud?
**Subhead:** Join hundreds of developers building faster with BASRUN.
**Button:** Register Now

## 9. Microcopy
**Nav Labels:** Features, Pricing, Documentation, Login, Sign Up
**Button Labels:**
- Primary: Get started free
- Secondary: Read the docs
- Action: Deploy Package
- UI: Cancel, Save Changes
**Forms (Register/Login):**
- Email: "Work Email" (placeholder: you@company.com)
- Password: "Password" (placeholder: Min. 8 characters)
- Helper: "By signing up, you agree to our Terms of Service."
**Dashboard Labels:**
- Table Headers: Package Name, Mode, Last Run, Status, Usage
- Empty State: "No packages deployed yet. Upload your first Basil script to get started."
- Modals: Upload Package, Configure Triggers, Manage Secrets

## 10. Elevator Pitch
BASRUN is a serverless cloud runtime that turns Basil scripts into scheduled jobs, webhooks, and REST APIs with zero infrastructure management and built-in security.

## 11. Meta & SEO
- **SEO Title:** BASRUN | The Serverless Runtime for Basil Packages
- **Meta Description:** Deploy Basil scripts as scheduled jobs, webhooks, or REST APIs. Sandboxed, secure, and developer-friendly serverless execution.
- **OpenGraph Title:** BASRUN: Serverless Basil Made Simple
- **OpenGraph Description:** Run your Basil code in the cloud. No servers, no hassle. Schedule tasks or build APIs in minutes.

## 12. Taglines & Headlines
**Taglines:**
1. Basil in the cloud. Done.
2. Serverless Basil, simplified.
3. Your code, our cloud, zero friction.

**Headlines:**
1. Run Basil packages anywhere, instantly.
2. The simplest way to deploy scheduled jobs and webhooks.
3. Turn your scripts into production services in seconds.
4. Serverless execution for the modern developer.
5. Focus on your code. We'll handle the runtime.
