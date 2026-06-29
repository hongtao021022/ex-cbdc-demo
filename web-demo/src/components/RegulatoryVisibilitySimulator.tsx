"use client";

import { useState } from "react";

type ObserverRole =
  | "Citizen"
  | "Commercial Bank"
  | "Central Bank"
  | "Regulator";

type PrivacyRegime =
  | "Full transparency"
  | "Tiered privacy"
  | "High privacy";

type AccessLevel = "full" | "masked" | "aggregate" | "hidden";
type LogType = "info" | "success" | "warning";

type FieldKey =
  | "transactionId"
  | "payerIdentity"
  | "payeeIdentity"
  | "payerAccount"
  | "payeeAccount"
  | "amount"
  | "purpose"
  | "location"
  | "riskScore"
  | "suspiciousFlag"
  | "status"
  | "timestamp";

type TransactionField = {
  key: FieldKey;
  label: string;
  fullValue: string;
  maskedValue: string;
  aggregateValue: string;
};

type ResolvedField = TransactionField & {
  access: AccessLevel;
  displayValue: string;
};

type LogEntry = {
  id: string;
  time: string;
  type: LogType;
  message: string;
};

const observerRoles: ObserverRole[] = [
  "Citizen",
  "Commercial Bank",
  "Central Bank",
  "Regulator",
];

const privacyRegimes: PrivacyRegime[] = [
  "Full transparency",
  "Tiered privacy",
  "High privacy",
];

function createLogEntry(type: LogType, message: string): LogEntry {
  return {
    id: `${Date.now()}-${Math.random()}`,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    type,
    message,
  };
}

export default function RegulatoryVisibilitySimulator() {
  const [observerRole, setObserverRole] =
    useState<ObserverRole>("Central Bank");

  const [privacyRegime, setPrivacyRegime] =
    useState<PrivacyRegime>("Tiered privacy");

  const [suspiciousActivity, setSuspiciousActivity] =
    useState(false);

  const [investigationAuthorized, setInvestigationAuthorized] =
    useState(false);

  const [logs, setLogs] = useState<LogEntry[]>([]);

  function addLog(type: LogType, message: string) {
    const entry = createLogEntry(type, message);

    setLogs((currentLogs) =>
      [entry, ...currentLogs].slice(0, 10)
    );
  }

  const transactionFields: TransactionField[] = [
    {
      key: "transactionId",
      label: "Transaction ID",
      fullValue: "TX-2026-0628-001",
      maskedValue: "TX-2026-••••-001",
      aggregateValue: "Included in daily settlement batch",
    },
    {
      key: "payerIdentity",
      label: "Payer identity",
      fullValue: "Alice Chen",
      maskedValue: "A•••• C•••",
      aggregateValue: "Verified retail user",
    },
    {
      key: "payeeIdentity",
      label: "Payee identity",
      fullValue: "Metro Health Pharmacy",
      maskedValue: "Metro H•••• Pharmacy",
      aggregateValue: "Licensed healthcare merchant",
    },
    {
      key: "payerAccount",
      label: "Payer account",
      fullValue: "CBDC-WALLET-1048",
      maskedValue: "CBDC-WALLET-••48",
      aggregateValue: "Retail CBDC wallet",
    },
    {
      key: "payeeAccount",
      label: "Payee account",
      fullValue: "MERCHANT-8831",
      maskedValue: "MERCHANT-••31",
      aggregateValue: "Verified merchant wallet",
    },
    {
      key: "amount",
      label: "Transaction amount",
      fullValue: "240 digital currency units",
      maskedValue: "200–250 digital currency units",
      aggregateValue: "Included in healthcare payment totals",
    },
    {
      key: "purpose",
      label: "Payment purpose",
      fullValue: "Prescription medicine",
      maskedValue: "Healthcare purchase",
      aggregateValue: "Essential-goods payment",
    },
    {
      key: "location",
      label: "Transaction location",
      fullValue: "Shanghai, China",
      maskedValue: "Shanghai metropolitan area",
      aggregateValue: "East China region",
    },
    {
      key: "riskScore",
      label: "Risk score",
      fullValue: suspiciousActivity
        ? "82 / 100 — elevated risk"
        : "24 / 100 — low risk",
      maskedValue: suspiciousActivity
        ? "Elevated risk band"
        : "Low risk band",
      aggregateValue: suspiciousActivity
        ? "Above normal monitoring threshold"
        : "Within normal monitoring range",
    },
    {
      key: "suspiciousFlag",
      label: "Suspicious activity flag",
      fullValue: suspiciousActivity
        ? "Flagged for enhanced review"
        : "No suspicious activity detected",
      maskedValue: suspiciousActivity
        ? "Enhanced review required"
        : "No active alert",
      aggregateValue: suspiciousActivity
        ? "Risk alert included in monitoring totals"
        : "No alert included in monitoring totals",
    },
    {
      key: "status",
      label: "Settlement status",
      fullValue: "Settled",
      maskedValue: "Completed",
      aggregateValue: "Included in settled transaction totals",
    },
    {
      key: "timestamp",
      label: "Transaction time",
      fullValue: "28 June 2026, 14:35:21",
      maskedValue: "28 June 2026, 14:35",
      aggregateValue: "Afternoon settlement window",
    },
  ];

  function getAccessLevel(fieldKey: FieldKey): AccessLevel {
    if (observerRole === "Citizen") {
      const fullFields: FieldKey[] = [
        "transactionId",
        "payerIdentity",
        "payerAccount",
        "payeeIdentity",
        "amount",
        "purpose",
        "location",
        "status",
        "timestamp",
      ];

      const maskedFields: FieldKey[] = ["payeeAccount"];

      if (fullFields.includes(fieldKey)) {
        return "full";
      }

      if (maskedFields.includes(fieldKey)) {
        return "masked";
      }

      return "hidden";
    }

    if (observerRole === "Commercial Bank") {
      if (
        fieldKey === "payeeIdentity" ||
        fieldKey === "payeeAccount"
      ) {
        if (privacyRegime === "Full transparency") {
          return "full";
        }

        return "masked";
      }

      if (
        privacyRegime === "High privacy" &&
        fieldKey === "location"
      ) {
        return "aggregate";
      }

      return "full";
    }

    if (observerRole === "Central Bank") {
      const identityFields: FieldKey[] = [
        "payerIdentity",
        "payeeIdentity",
        "payerAccount",
        "payeeAccount",
      ];

      if (identityFields.includes(fieldKey)) {
        if (privacyRegime === "Full transparency") {
          return "full";
        }

        if (privacyRegime === "Tiered privacy") {
          return "masked";
        }

        return "aggregate";
      }

      if (
        privacyRegime === "High privacy" &&
        (fieldKey === "purpose" || fieldKey === "location")
      ) {
        return "aggregate";
      }

      return "full";
    }

    const identityFields: FieldKey[] = [
      "payerIdentity",
      "payeeIdentity",
      "payerAccount",
      "payeeAccount",
    ];

    if (
      investigationAuthorized &&
      identityFields.includes(fieldKey)
    ) {
      return "full";
    }

    if (identityFields.includes(fieldKey)) {
      if (privacyRegime === "Full transparency") {
        return "full";
      }

      if (privacyRegime === "Tiered privacy") {
        return "masked";
      }

      return "hidden";
    }

    if (
      privacyRegime === "High privacy" &&
      fieldKey === "location"
    ) {
      return "aggregate";
    }

    if (
      privacyRegime === "High privacy" &&
      fieldKey === "purpose" &&
      !suspiciousActivity &&
      !investigationAuthorized
    ) {
      return "aggregate";
    }

    return "full";
  }

  function getDisplayValue(
    field: TransactionField,
    access: AccessLevel
  ) {
    if (access === "full") {
      return field.fullValue;
    }

    if (access === "masked") {
      return field.maskedValue;
    }

    if (access === "aggregate") {
      return field.aggregateValue;
    }

    return "Protected by the current privacy policy";
  }

  const resolvedFields: ResolvedField[] =
    transactionFields.map((field) => {
      const access = getAccessLevel(field.key);

      return {
        ...field,
        access,
        displayValue: getDisplayValue(field, access),
      };
    });

  const visibleFields = resolvedFields.filter(
    (field) => field.access !== "hidden"
  );

  const hiddenFields = resolvedFields.filter(
    (field) => field.access === "hidden"
  );

  const fullyVisibleCount = resolvedFields.filter(
    (field) => field.access === "full"
  ).length;

  const maskedCount = resolvedFields.filter(
    (field) => field.access === "masked"
  ).length;

  const aggregateCount = resolvedFields.filter(
    (field) => field.access === "aggregate"
  ).length;

  const privacyScore = Math.round(
    ((maskedCount * 0.6 +
      aggregateCount * 0.8 +
      hiddenFields.length) /
      resolvedFields.length) *
      100
  );

  const regulatoryCoverage = Math.round(
    (visibleFields.length / resolvedFields.length) * 100
  );

  const identityFields = resolvedFields.filter((field) =>
    [
      "payerIdentity",
      "payeeIdentity",
      "payerAccount",
      "payeeAccount",
    ].includes(field.key)
  );

  const identityExposure = identityFields.every(
    (field) => field.access === "full"
  )
    ? "Full"
    : identityFields.some(
          (field) =>
            field.access === "full" ||
            field.access === "masked"
        )
      ? "Selective"
      : "Minimal";

  function changeObserverRole(nextRole: ObserverRole) {
    setObserverRole(nextRole);

    addLog(
      "info",
      `Observer changed to ${nextRole}. The visibility policy was recalculated.`
    );
  }

  function changePrivacyRegime(
    nextRegime: PrivacyRegime
  ) {
    setPrivacyRegime(nextRegime);

    addLog(
      "info",
      `Privacy regime changed to ${nextRegime}.`
    );
  }

  function toggleSuspiciousActivity() {
    const nextValue = !suspiciousActivity;

    setSuspiciousActivity(nextValue);

    addLog(
      nextValue ? "warning" : "info",
      nextValue
        ? "The transaction was flagged as suspicious and moved into enhanced monitoring."
        : "The suspicious activity flag was removed."
    );
  }

  function toggleInvestigationAuthorization() {
    const nextValue = !investigationAuthorized;

    setInvestigationAuthorized(nextValue);

    addLog(
      nextValue ? "success" : "info",
      nextValue
        ? "Investigation authorization granted. The regulator may access protected identities."
        : "Investigation authorization revoked. Identity protection was restored."
    );
  }

  function resetSimulation() {
    setObserverRole("Central Bank");
    setPrivacyRegime("Tiered privacy");
    setSuspiciousActivity(false);
    setInvestigationAuthorized(false);

    setLogs([
      createLogEntry(
        "info",
        "Regulatory visibility simulation reset to the default tiered-privacy policy."
      ),
    ]);
  }

  return (
    <section
      id="regulatory-visibility"
      className="scroll-mt-8 border-t border-white/10 py-14"
    >
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Interactive prototype
        </p>

        <h2 className="mt-3 text-3xl font-semibold">
          Regulatory visibility and privacy
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          Compare how transaction data is disclosed to citizens,
          commercial banks, central banks, and regulators under
          different privacy and investigation rules.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
            Transaction overview
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Retail CBDC payment
          </h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Amount"
              value="240 units"
            />

            <MetricCard
              label="Status"
              value="Settled"
            />

            <MetricCard
              label="Purpose"
              value="Prescription medicine"
            />

            <MetricCard
              label="Risk state"
              value={
                suspiciousActivity
                  ? "Enhanced review"
                  : "Normal monitoring"
              }
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
            Policy controls
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Disclosure configuration
          </h3>

          <label className="mt-6 block">
            <span className="text-sm font-medium text-slate-300">
              Privacy regime
            </span>

            <select
              value={privacyRegime}
              onChange={(event) =>
                changePrivacyRegime(
                  event.target.value as PrivacyRegime
                )
              }
              className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
            >
              {privacyRegimes.map((regime) => (
                <option key={regime} value={regime}>
                  {regime}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-5 space-y-3">
            <PolicyToggle
              label="Suspicious activity flag"
              description="Apply enhanced transaction monitoring."
              active={suspiciousActivity}
              activeLabel="Flagged"
              inactiveLabel="Normal"
              tone="warning"
              onClick={toggleSuspiciousActivity}
            />

            <PolicyToggle
              label="Investigation authorization"
              description="Allow the regulator to reveal protected identities."
              active={investigationAuthorized}
              activeLabel="Authorized"
              inactiveLabel="Not authorized"
              tone="success"
              onClick={toggleInvestigationAuthorization}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
          Observer role
        </p>

        <h3 className="mt-2 text-xl font-semibold">
          Choose who is viewing the transaction
        </h3>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {observerRoles.map((role) => {
            const isSelected = observerRole === role;

            return (
              <button
                key={role}
                type="button"
                onClick={() => changeObserverRole(role)}
                className={`rounded-xl border px-4 py-4 text-left transition ${
                  isSelected
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-white/10 bg-slate-950/50 text-slate-400 hover:bg-white/10"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {role}
                </span>

                <span className="mt-2 block text-xs leading-5 opacity-75">
                  {getRoleDescription(role)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-400">
                Disclosed data
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Visible transaction fields
              </h3>
            </div>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              {visibleFields.length} visible
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {visibleFields.map((field) => (
              <FieldCard key={field.key} field={field} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-400">
                Protected data
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                Hidden transaction fields
              </h3>
            </div>

            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs text-amber-300">
              {hiddenFields.length} hidden
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {hiddenFields.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-sm text-slate-500">
                No fields are fully hidden under this
                configuration.
              </div>
            ) : (
              hiddenFields.map((field) => (
                <FieldCard key={field.key} field={field} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ScoreCard
          label="Privacy protection"
          value={`${privacyScore}%`}
          description="Share of data protected by masking, aggregation, or concealment."
        />

        <ScoreCard
          label="Regulatory coverage"
          value={`${regulatoryCoverage}%`}
          description="Share of transaction fields available to the selected observer."
        />

        <ScoreCard
          label="Identity exposure"
          value={identityExposure}
          description="Level of payer and payee identity disclosure."
        />

        <ScoreCard
          label="Investigation status"
          value={
            investigationAuthorized
              ? "Authorized"
              : "Restricted"
          }
          description="Whether protected identities can be revealed."
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
              Audit log
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Visibility policy events
            </h3>
          </div>

          <button
            type="button"
            onClick={resetSimulation}
            className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
          >
            Reset
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {logs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-500">
              No policy events yet. Change an observer or
              disclosure rule to generate an audit log.
            </div>
          ) : (
            logs.map((entry) => (
              <div
                key={entry.id}
                className="flex gap-4 rounded-xl border border-white/10 bg-slate-950/50 p-4"
              >
                <div
                  className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                    entry.type === "success"
                      ? "bg-emerald-400"
                      : entry.type === "warning"
                        ? "bg-amber-400"
                        : "bg-cyan-400"
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-6 text-slate-200">
                    {entry.message}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {entry.time}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function getRoleDescription(role: ObserverRole) {
  if (role === "Citizen") {
    return "Views personal payment details but not internal risk analytics.";
  }

  if (role === "Commercial Bank") {
    return "Performs customer due diligence and transaction monitoring.";
  }

  if (role === "Central Bank") {
    return "Observes settlement and systemic risk with minimized identity data.";
  }

  return "Reviews compliance and may reveal identities with authorization.";
}

type MetricCardProps = {
  label: string;
  value: string;
};

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-2 font-semibold text-slate-100">
        {value}
      </p>
    </div>
  );
}

type PolicyToggleProps = {
  label: string;
  description: string;
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  tone: "warning" | "success";
  onClick: () => void;
};

function PolicyToggle({
  label,
  description,
  active,
  activeLabel,
  inactiveLabel,
  tone,
  onClick,
}: PolicyToggleProps) {
  const activeClasses =
    tone === "warning"
      ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
      : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-950/50 p-4">
      <div>
        <p className="text-sm font-semibold text-slate-200">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onClick}
        className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
          active
            ? activeClasses
            : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
        }`}
      >
        {active ? activeLabel : inactiveLabel}
      </button>
    </div>
  );
}

type FieldCardProps = {
  field: ResolvedField;
};

function FieldCard({ field }: FieldCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-300">
          {field.label}
        </p>

        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${
            field.access === "full"
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : field.access === "masked"
                ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                : field.access === "aggregate"
                  ? "border-violet-400/20 bg-violet-400/10 text-violet-300"
                  : "border-amber-400/20 bg-amber-400/10 text-amber-300"
          }`}
        >
          {field.access}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {field.displayValue}
      </p>
    </div>
  );
}

type ScoreCardProps = {
  label: string;
  value: string;
  description: string;
};

function ScoreCard({
  label,
  value,
  description,
}: ScoreCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-2 text-2xl font-semibold text-slate-100">
        {value}
      </p>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}
