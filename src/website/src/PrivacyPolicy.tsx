import { Head } from 'vite-react-ssg';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-canvas">
      <Head>
        <title>Privacy Policy — Open Routines</title>
        <link rel="canonical" href="https://open-routines.com/privacy/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://open-routines.com/privacy/" />
        <meta property="og:title" content="Privacy Policy — Open Routines" />
        <meta
          property="og:description"
          content="How Open Routines handles your data. Local-first, no telemetry, no servers."
        />
        <meta property="og:image" content="https://open-routines.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy — Open Routines" />
        <meta
          name="twitter:description"
          content="How Open Routines handles your data. Local-first, no telemetry, no servers."
        />
        <meta name="twitter:image" content="https://open-routines.com/og-image.jpg" />
      </Head>
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-10"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Open Routines
        </a>

        <h1 className="text-[36px] font-semibold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: April 25, 2025</p>

        <div className="space-y-10 text-[15px] leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">Overview</h2>
            <p>
              Open Routines is a local-first desktop application. Your data stays on your machine.
              We do not operate servers that store your personal information, routine
              configurations, or the results of your routines.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">
              Google OAuth &amp; Connected Services
            </h2>
            <p className="mb-3">
              Open Routines optionally integrates with Google services (Gmail, Google Calendar,
              Google Drive) via OAuth 2.0. When you connect a Google account:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/70">
              <li>
                OAuth tokens are stored locally on your device in the application&apos;s secure
                storage.
              </li>
              <li>
                Tokens are used solely to perform actions you explicitly configure in your routines
                (e.g. reading emails, creating calendar events).
              </li>
              <li>We never transmit your Google tokens or data to our servers.</li>
              <li>
                You can revoke access at any time via your{' '}
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noreferrer"
                  className="text-accent underline underline-offset-2"
                >
                  Google Account settings
                </a>
                .
              </li>
            </ul>
            <p className="mt-3">
              Open Routines&apos; use of Google user data complies with the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline underline-offset-2"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">AI Model Providers</h2>
            <p>
              Open Routines sends prompts and context to the AI model provider you configure (e.g.
              Anthropic, OpenAI). This communication happens directly from your device to the
              provider using your own API key. Each provider&apos;s privacy policy governs how they
              handle that data.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">
              Analytics &amp; Crash Reporting
            </h2>
            <p>
              Open Routines does not collect analytics or crash reports. No telemetry is sent from
              the application.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">Contact</h2>
            <p>
              If you have questions about this policy, reach us at{' '}
              <a
                href="mailto:hello@open-routines.com"
                className="text-accent underline underline-offset-2"
              >
                hello@open-routines.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
