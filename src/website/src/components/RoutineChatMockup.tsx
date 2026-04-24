import type { ReactNode } from 'react';
import { TriggerChip } from './shared';

function ToolRow({ call, detail }: { call: string; detail: string }) {
  return (
    <div>
      {'› Ran '}
      <span className="rounded px-1 bg-accent-soft text-accent text-code">{call}</span>
      {' — ' + detail}
    </div>
  );
}

function AIBlock({
  tools,
  children,
}: {
  tools?: { call: string; detail: string }[];
  children: ReactNode;
}) {
  return (
    <div className="bg-secondary border border-muted rounded-lg shadow-md p-5 mb-4">
      {tools && tools.length > 0 && (
        <div className="space-y-0.5 mb-4 font-mono text-code text-fg-dim">
          {tools.map((t, i) => (
            <ToolRow key={i} call={t.call} detail={t.detail} />
          ))}
        </div>
      )}
      <div className="space-y-2 text-body-sm leading-relaxed">{children}</div>
    </div>
  );
}

function UserPrompt({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-accent px-4 py-3 text-body-sm leading-relaxed text-accent-foreground shadow-md">
        {children}
      </div>
    </div>
  );
}

function TriggerEvent({ label }: { label: string }) {
  return (
    <div className="flex justify-center mb-5">
      <div className="inline-flex items-center gap-2 rounded-full bg-muted border border-muted px-3 py-1.5 font-mono text-code text-fg-dim">
        <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
        {label}
      </div>
    </div>
  );
}

function ExpenseManagerChat() {
  return (
    <>
      <TriggerEvent label="invoice_2024_03_chez_marcel.pdf added" />
      <UserPrompt>
        When a new expense is added, classify it, extract the data, and add it to my expense
        spreadsheet.
      </UserPrompt>
      <AIBlock tools={[{ call: 'read_file', detail: 'invoice_2024_03_chez_marcel.pdf' }]}>
        <p>
          New invoice added — <strong>Chez Marcel</strong>, 12 March 2024.
        </p>
        <p className="text-fg-muted">
          Diner expense · <strong>€48.50</strong> · classified as <strong>Food & Dining</strong>.
        </p>
      </AIBlock>
      <AIBlock tools={[{ call: 'sheets_append', detail: '"Food & Dining" tab · row 47' }]}>
        <p>
          Added to the <strong>Food & Dining</strong> section of your expense spreadsheet.
        </p>
      </AIBlock>
    </>
  );
}

function DocDriftChat() {
  return (
    <>
      <TriggerEvent label="services/payments/openapi.yaml changed" />
      <UserPrompt>
        When the API definition of these services change, analyse the changes and update the
        architecture diagram.
      </UserPrompt>
      <AIBlock
        tools={[
          { call: 'read_file', detail: 'services/payments/openapi.yaml' },
          { call: 'read_file', detail: 'services/auth/openapi.yaml' },
          { call: 'diff', detail: 'comparing against last snapshot' },
        ]}
      >
        <p>
          <strong>2 services changed</strong> since last snapshot:
        </p>
        <div className="text-fg-muted space-y-1 mt-1">
          <p>
            <code>payments</code> — new endpoint <code>POST /refunds</code> added. Not reflected in
            diagram.
          </p>
          <p>
            <code>auth</code> — <code>/token</code> response: <code>expires_in</code> changed from
            milliseconds to seconds.
          </p>
        </div>
      </AIBlock>
      <AIBlock tools={[{ call: 'write_file', detail: 'docs/architecture.md' }]}>
        <p>Architecture diagram updated — 2 services patched.</p>
      </AIBlock>
    </>
  );
}

function NewsSummaryChat() {
  return (
    <>
      <TriggerEvent label="Triggered · 07:00 · weekdays" />
      <UserPrompt>
        Check the front pages of the Times, Libération, and El País. Create an executive summary of
        the main news in French.
      </UserPrompt>
      <AIBlock
        tools={[
          { call: 'web_fetch', detail: 'thetimes.co.uk' },
          { call: 'web_fetch', detail: 'liberation.fr' },
          { call: 'web_fetch', detail: 'elpais.com' },
        ]}
      >
        <p className="font-semibold">Résumé — 22 avril 2025</p>
        <div className="text-fg-muted space-y-2 mt-2">
          <p>
            <strong className="text-foreground">Royaume-Uni</strong> — Le gouvernement annonce un
            plan de 40 milliards £ pour la transition énergétique, incluant la fermeture accélérée
            des centrales à charbon.
          </p>
          <p>
            <strong className="text-foreground">France</strong> — Le Conseil constitutionnel valide
            les principales dispositions de la loi immigration. La gauche appelle à une mobilisation
            nationale.
          </p>
          <p>
            <strong className="text-foreground">Espagne</strong> — Le gouvernement Sánchez survit au
            vote de confiance grâce au soutien des indépendantistes catalans dans un accord de
            dernière minute.
          </p>
        </div>
      </AIBlock>
    </>
  );
}

function InvoiceTrackerChat() {
  return (
    <>
      <TriggerEvent label="Gmail · subject:invoice · 47 new threads" />
      <UserPrompt>
        Search Gmail for this year&apos;s invoices, download the PDFs, classify each one, and update
        my invoices spreadsheet.
      </UserPrompt>
      <AIBlock
        tools={[
          { call: 'gmail_search', detail: 'subject:invoice after:2026/01/01 — 47 results' },
          { call: 'gmail_get_attachment', detail: '× 18 PDFs downloaded' },
          { call: 'read_file', detail: 'parsing PDFs with pdftotext' },
        ]}
      >
        <p>
          Found <strong>18 invoices</strong> in your Gmail inbox. 29 emails were shipping
          notifications or order confirmations — skipped.
        </p>
        <div className="text-fg-muted space-y-1 mt-2">
          <p>
            <strong className="text-foreground">SaaS subscriptions</strong> — Figma, Linear, Vercel
            · <strong>€640.00</strong>
          </p>
          <p>
            <strong className="text-foreground">Cloud infra</strong> — AWS, Hetzner ·{' '}
            <strong>€1,180.40</strong>
          </p>
          <p>
            <strong className="text-foreground">Other</strong> — 9 vendors ·{' '}
            <strong>€870.19</strong>
          </p>
        </div>
      </AIBlock>
      <AIBlock tools={[{ call: 'write_file', detail: 'Documents/Invoices/Invoices_2026.xlsx' }]}>
        <p>
          Spreadsheet updated — 18 rows, colour-coded by category.{' '}
          <strong>Grand total: €2,690.59</strong>
        </p>
      </AIBlock>
    </>
  );
}

type RoutineId = 1 | 2 | 3 | 4;

const CHAT_HEADERS: Record<RoutineId, { triggerType: string; triggerLabel: string }> = {
  1: { triggerType: 'watcher', triggerLabel: '~/Documents/Invoices/**' },
  2: { triggerType: 'watcher', triggerLabel: 'services/*/openapi.yaml' },
  3: { triggerType: 'cron', triggerLabel: '0 7 * * 1-5' },
  4: { triggerType: 'gmail', triggerLabel: 'subject:invoice' },
};

export function RoutineChatMockup({
  routineId,
  name,
  onBack,
}: {
  routineId: RoutineId;
  name: string;
  onBack?: () => void;
}) {
  const header = CHAT_HEADERS[routineId];

  return (
    <div>
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-1 mb-4 text-body-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-none bg-transparent p-0"
        >
          <svg
            viewBox="0 0 16 16"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m10 3-5 5 5 5" />
          </svg>
          Routines
        </button>
      )}
      <div className="flex items-end justify-between gap-4 mb-[22px]">
        <div>
          <h1 className="m-0 mb-1 text-heading tracking-title font-semibold">{name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-body-sm font-mono">
            <TriggerChip label={header.triggerType} />
            <span>·</span>
            <span className="text-fg-dim">{header.triggerLabel}</span>
          </div>
        </div>
      </div>

      {routineId === 1 && <ExpenseManagerChat />}
      {routineId === 2 && <DocDriftChat />}
      {routineId === 3 && <NewsSummaryChat />}
      {routineId === 4 && <InvoiceTrackerChat />}
    </div>
  );
}
