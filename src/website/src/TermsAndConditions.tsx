export function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-canvas">
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

        <h1 className="text-[36px] font-semibold tracking-tight mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted-foreground mb-12">Last updated: April 25, 2025</p>

        <div className="space-y-10 text-[15px] leading-relaxed text-foreground/80">
          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">Acceptance</h2>
            <p>
              By downloading or using Open Routines, you agree to these terms. If you do not agree,
              do not use the application.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">License</h2>
            <p>
              Open Routines is open-source software. You may use, modify, and distribute it under
              the terms of its open-source license as published on{' '}
              <a
                href="https://github.com/tessellate-digital/open-routines-desktop"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline underline-offset-2"
              >
                GitHub
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">
              Your Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-2 text-foreground/70">
              <li>You are responsible for the routines you create and the actions they perform.</li>
              <li>
                You must comply with the terms of any third-party services you connect (Google,
                Anthropic, OpenAI, etc.).
              </li>
              <li>
                You must not use Open Routines to perform actions that are illegal, abusive, or
                violate any third-party terms of service.
              </li>
              <li>You are responsible for keeping your API keys and OAuth tokens secure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">Third-Party Services</h2>
            <p>
              Open Routines integrates with third-party AI providers and services. We are not
              responsible for their availability, accuracy, or conduct. Each provider&apos;s own
              terms and policies apply to your use of their services.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">
              Disclaimer of Warranties
            </h2>
            <p>
              Open Routines is provided &quot;as is&quot; without warranties of any kind. We do not
              guarantee that the application will be error-free, uninterrupted, or produce any
              particular result. Use it at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, the authors of Open Routines shall not be
              liable for any indirect, incidental, special, or consequential damages arising from
              your use of the application, including but not limited to data loss or unintended
              actions taken by your routines.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">Changes</h2>
            <p>
              We may update these terms from time to time. Continued use of the application after
              changes are posted constitutes acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-[18px] font-semibold text-foreground mb-3">Contact</h2>
            <p>
              Questions about these terms?{' '}
              <a
                href="mailto:hello@open-routines.com"
                className="text-accent underline underline-offset-2"
              >
                hello@open-routines.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
