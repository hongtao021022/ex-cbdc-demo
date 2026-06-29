import CrossBorderSimulator from "@/components/CrossBorderSimulator";
import ProgrammablePaymentSimulator from "@/components/ProgrammablePaymentSimulator";

const scenarios = [
  {
    title: "Cross-border PvP",
    description:
      "Simulate atomic settlement between two currencies and prevent broken trades.",
    status: "Ready",
    href: "#cross-border-pvp",
  },
  {
    title: "Programmable Payments",
    description:
      "Explore restricted public payments, eligible merchants, and policy compliance.",
    status: "Ready",
    href: "#programmable-payments",
  },
  {
    title: "Regulatory Visibility",
    description:
      "Compare what users, commercial banks, central banks, and regulators can observe.",
    status: "Planned",
    href: "#scenarios",
  },
];


const researchDimensions = [
  "Settlement efficiency",
  "Privacy",
  "Regulatory visibility",
  "Financial stability",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-12 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-cyan-400">
              DIGITAL MONEY LAB
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Interactive financial infrastructure research
            </p>
          </div>

          <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300">
            Demo Mode
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-20">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
              Global Digital Money Infrastructure Sandbox
            </p>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Explore how digital money systems behave under different
              institutional rules.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-300">
              An interactive research demo for studying CBDCs, tokenized
              deposits, cross-border settlement, programmable payments,
              privacy, and regulatory oversight.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              {researchDimensions.map((dimension) => (
                <span
                  key={dimension}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300"
                >
                  {dimension}
                </span>
              ))}
            </div>

            <a
              href="#scenarios"
              className="mt-10 inline-flex rounded-lg bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore scenarios
            </a>
          </div>
        </section>

        <section
          id="scenarios"
          className="border-t border-white/10 py-12"
        >
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Simulation modules
            </p>
            <h2 className="mt-3 text-3xl font-semibold">
              Start with a policy scenario
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {scenarios.map((scenario) => (
  <a
    key={scenario.title}
    href={scenario.href}
    className="block rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-white/[0.07]"
  >

                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-semibold">{scenario.title}</h3>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                    {scenario.status}
                  </span>
                </div>

                <p className="mt-4 leading-7 text-slate-400">
                  {scenario.description}
                </p>
              </a>
            ))}
          </div>
        </section>
        <CrossBorderSimulator />
        <ProgrammablePaymentSimulator />
        <footer className="border-t border-white/10 py-6 text-sm text-slate-500">
          Independent research demo inspired by public digital-money
          infrastructure projects.
        </footer>
      </div>
    </main>
  );
}
