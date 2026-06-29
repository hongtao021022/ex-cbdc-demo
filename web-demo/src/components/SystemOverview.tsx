type OverviewMetric = {
  value: string;
  label: string;
  description: string;
};

type ResearchArea = {
  number: string;
  title: string;
  description: string;
  href: string;
};

const overviewMetrics: OverviewMetric[] = [
  {
    value: "4",
    label: "Ready modules",
    description: "Four interactive scenarios are available in the sandbox.",
  },
  {
    value: "4",
    label: "Policy dimensions",
    description:
      "Settlement, programmability, oversight, and financial stability.",
  },
  {
    value: "100%",
    label: "Local simulation",
    description:
      "All scenarios run in the browser without transferring real funds.",
  },
  {
    value: "0",
    label: "Real-world exposure",
    description:
      "No production ledger, bank account, or personal data is connected.",
  },
];

const researchAreas: ResearchArea[] = [
  {
    number: "01",
    title: "Settlement efficiency",
    description:
      "Test whether both payment legs complete together and prevent broken cross-border trades.",
    href: "#cross-border-pvp",
  },
  {
    number: "02",
    title: "Programmable money",
    description:
      "Explore merchant eligibility, spending restrictions, balance controls, and payment limits.",
    href: "#programmable-payments",
  },
  {
    number: "03",
    title: "Privacy and oversight",
    description:
      "Compare what citizens, banks, central banks, and regulators can observe.",
    href: "#regulatory-visibility",
  },
  {
    number: "04",
    title: "Financial stability",
    description:
      "Study withdrawal shocks, market funding disruption, and central bank liquidity support.",
    href: "#financial-stability",
  },
];

const prototypeBoundaries = [
  {
    title: "No real money",
    description:
      "All balances and transactions are fictional simulation values.",
  },
  {
    title: "No live banking connection",
    description:
      "The prototype does not connect to payment networks, bank accounts, or production ledgers.",
  },
  {
    title: "Simplified policy rules",
    description:
      "The models isolate selected institutional rules rather than reproducing an entire financial system.",
  },
  {
    title: "Research and education",
    description:
      "Results are intended for demonstration, learning, and policy discussion—not financial advice.",
  },
];

export default function SystemOverview() {
  return (
    <section
      id="system-overview"
      className="border-t border-white/10 py-14"
    >
      <div className="mb-8 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          System overview
        </p>

        <h2 className="mt-3 text-3xl font-semibold">
          One sandbox, four institutional experiments
        </h2>

        <p className="mt-4 leading-7 text-slate-400">
          The demo separates complex digital-money infrastructure into four
          focused simulations. Each module changes a small set of rules so
          their effects can be observed clearly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewMetrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <p className="text-3xl font-semibold text-slate-100">
              {metric.value}
            </p>

            <p className="mt-2 font-semibold text-cyan-300">
              {metric.label}
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {metric.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
              Research coverage
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Explore the system by policy objective
            </h3>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {researchAreas.map((area) => (
              <a
                key={area.number}
                href={area.href}
                className="group rounded-xl border border-white/10 bg-slate-950/50 p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/10 text-xs font-bold text-cyan-300">
                    {area.number}
                  </span>

                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </div>

                <h4 className="mt-4 font-semibold text-slate-100">
                  {area.title}
                </h4>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {area.description}
                </p>
              </a>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-amber-400/20 bg-amber-400/[0.05] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-300">
            Prototype boundaries
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            What this demo does not do
          </h3>

          <div className="mt-6 space-y-5">
            {prototypeBoundaries.map((boundary) => (
              <div
                key={boundary.title}
                className="flex gap-3"
              >
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3 w-3 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    {boundary.title}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    {boundary.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
