"use client";

import { useState } from "react";

type PaymentStatus = "idle" | "success" | "failed";
type LogType = "info" | "success" | "error";

type MerchantCategory =
  | "Food"
  | "Healthcare"
  | "Transport"
  | "Education"
  | "Luxury";

type Merchant = {
  id: string;
  name: string;
  category: MerchantCategory;
};

type LogEntry = {
  id: string;
  time: string;
  type: LogType;
  message: string;
};

const merchants: Merchant[] = [
  {
    id: "fresh-market",
    name: "Fresh Market",
    category: "Food",
  },
  {
    id: "city-pharmacy",
    name: "City Pharmacy",
    category: "Healthcare",
  },
  {
    id: "metro-transit",
    name: "Metro Transit",
    category: "Transport",
  },
  {
    id: "learning-center",
    name: "Community Learning Center",
    category: "Education",
  },
  {
    id: "luxury-boutique",
    name: "Luxury Boutique",
    category: "Luxury",
  },
];

const categories: MerchantCategory[] = [
  "Food",
  "Healthcare",
  "Transport",
  "Education",
  "Luxury",
];

const initialCitizenBalance = 500;
const initialPaymentAmount = 120;
const initialPaymentLimit = 150;

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

export default function ProgrammablePaymentSimulator() {
  const [citizenBalance, setCitizenBalance] = useState(
    initialCitizenBalance
  );

  const [merchantBalances, setMerchantBalances] = useState<
    Record<string, number>
  >({});

  const [selectedMerchantId, setSelectedMerchantId] = useState(
    merchants[0].id
  );

  const [paymentAmount, setPaymentAmount] = useState(
    initialPaymentAmount
  );

  const [paymentLimit, setPaymentLimit] = useState(
    initialPaymentLimit
  );

  const [programActive, setProgramActive] = useState(true);

  const [allowedCategories, setAllowedCategories] = useState<
    MerchantCategory[]
  >(["Food", "Healthcare", "Transport"]);

  const [status, setStatus] = useState<PaymentStatus>("idle");

  const [message, setMessage] = useState(
    "Choose a merchant and run the programmable payment."
  );

  const [logs, setLogs] = useState<LogEntry[]>([]);

  const selectedMerchant =
    merchants.find(
      (merchant) => merchant.id === selectedMerchantId
    ) ?? merchants[0];

  const selectedMerchantBalance =
    merchantBalances[selectedMerchant.id] ?? 0;

  function addLog(type: LogType, logMessage: string) {
    const entry = createLogEntry(type, logMessage);

    setLogs((currentLogs) =>
      [entry, ...currentLogs].slice(0, 10)
    );
  }

  function toggleCategory(category: MerchantCategory) {
    setAllowedCategories((currentCategories) => {
      if (currentCategories.includes(category)) {
        return currentCategories.filter(
          (currentCategory) => currentCategory !== category
        );
      }

      return [...currentCategories, category];
    });

    setStatus("idle");
    setMessage(
      "Policy rules changed. Run the payment to validate the new configuration."
    );
  }

  function runPayment() {
    addLog(
      "info",
      `Validating ${paymentAmount} digital currency units for ${selectedMerchant.name}.`
    );

    if (!programActive) {
      const failureMessage =
        "Payment rejected because the public payment program is inactive.";

      setStatus("failed");
      setMessage(failureMessage);
      addLog("error", failureMessage);

      return;
    }

    if (paymentAmount <= 0) {
      const failureMessage =
        "Payment rejected because the amount must be greater than zero.";

      setStatus("failed");
      setMessage(failureMessage);
      addLog("error", failureMessage);

      return;
    }

    if (paymentAmount > citizenBalance) {
      const failureMessage =
        `Payment rejected because the citizen only holds ` +
        `${citizenBalance} programmable currency units.`;

      setStatus("failed");
      setMessage(failureMessage);
      addLog("error", failureMessage);

      return;
    }

    if (paymentAmount > paymentLimit) {
      const failureMessage =
        `Payment rejected because ${paymentAmount} exceeds the ` +
        `single-payment limit of ${paymentLimit}.`;

      setStatus("failed");
      setMessage(failureMessage);
      addLog("error", failureMessage);

      return;
    }

    if (
      !allowedCategories.includes(selectedMerchant.category)
    ) {
      const failureMessage =
        `Payment rejected because ${selectedMerchant.category} ` +
        `merchants are not eligible under the current policy.`;

      setStatus("failed");
      setMessage(failureMessage);

      addLog(
        "error",
        `Policy validation failed for ${selectedMerchant.name}: ` +
          `${selectedMerchant.category} is not an allowed category.`
      );

      return;
    }

    setCitizenBalance(
      (currentBalance) => currentBalance - paymentAmount
    );

    setMerchantBalances((currentBalances) => ({
      ...currentBalances,
      [selectedMerchant.id]:
        (currentBalances[selectedMerchant.id] ?? 0) +
        paymentAmount,
    }));

    setStatus("success");

    setMessage(
      `Payment completed: ${paymentAmount} programmable currency ` +
        `units were transferred to ${selectedMerchant.name}.`
    );

    addLog(
      "success",
      `Payment approved for ${selectedMerchant.name}. ` +
        `${paymentAmount} units were transferred under the ` +
        `${selectedMerchant.category} spending rule.`
    );
  }

  function resetSimulation() {
    setCitizenBalance(initialCitizenBalance);
    setMerchantBalances({});
    setSelectedMerchantId(merchants[0].id);
    setPaymentAmount(initialPaymentAmount);
    setPaymentLimit(initialPaymentLimit);
    setProgramActive(true);

    setAllowedCategories([
      "Food",
      "Healthcare",
      "Transport",
    ]);

    setStatus("idle");

    setMessage(
      "Choose a merchant and run the programmable payment."
    );

    setLogs([
      createLogEntry(
        "info",
        "Programmable payment simulation reset to its initial policy."
      ),
    ]);
  }

  return (
    <section
  id="programmable-payments"
  className="scroll-mt-8 border-t border-white/10 py-14"
>

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Interactive prototype
        </p>

        <h2 className="mt-3 text-3xl font-semibold">
          Programmable public payments
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          Test how public digital funds can be restricted by
          merchant category, payment limits, program status, and
          available balance.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-semibold">
            Public payment wallet
          </h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Citizen balance"
              value={citizenBalance}
              unit="units"
            />

            <MetricCard
              label={`${selectedMerchant.name} balance`}
              value={selectedMerchantBalance}
              unit="units"
            />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">
                  Program status
                </p>

                <p className="mt-1 font-semibold text-slate-100">
                  {programActive ? "Active" : "Suspended"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setProgramActive(
                    (currentStatus) => !currentStatus
                  );

                  setStatus("idle");
                  setMessage(
                    "Program status changed. Run the payment to test the new rule."
                  );
                }}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  programActive
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-red-400/30 bg-red-400/10 text-red-300"
                }`}
              >
                {programActive ? "Active" : "Suspended"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-semibold">
            Payment proposal
          </h3>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">
                Merchant
              </span>

              <select
                value={selectedMerchantId}
                onChange={(event) => {
                  setSelectedMerchantId(event.target.value);
                  setStatus("idle");

                  setMessage(
                    "Merchant changed. Run the payment to validate eligibility."
                  );
                }}
                className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
              >
                {merchants.map((merchant) => (
                  <option
                    key={merchant.id}
                    value={merchant.id}
                  >
                    {merchant.name} — {merchant.category}
                  </option>
                ))}
              </select>
            </label>

            <NumberInput
              label="Payment amount"
              value={paymentAmount}
              onChange={setPaymentAmount}
            />

            <NumberInput
              label="Single-payment limit"
              value={paymentLimit}
              onChange={setPaymentLimit}
            />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={runPayment}
              className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Run policy validation
            </button>

            <button
              type="button"
              onClick={resetSimulation}
              className="rounded-lg border border-white/15 px-5 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
              Policy controls
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Eligible merchant categories
            </h3>
          </div>

          <p className="text-sm text-slate-500">
            Select the permitted uses of public funds.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isAllowed =
              allowedCategories.includes(category);

            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isAllowed
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-white/5 text-slate-500 hover:bg-white/10"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`mt-6 rounded-2xl border p-5 ${
          status === "success"
            ? "border-emerald-400/30 bg-emerald-400/10"
            : status === "failed"
              ? "border-red-400/30 bg-red-400/10"
              : "border-white/10 bg-white/[0.04]"
        }`}
      >
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
          Payment result
        </p>

        <p className="mt-2 leading-7 text-slate-200">
          {message}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
              Policy log
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Validation events
            </h3>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
            Latest 10
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {logs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-500">
              No payment events yet. Run the simulation to
              generate a policy log.
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
                      : entry.type === "error"
                        ? "bg-red-400"
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

type MetricCardProps = {
  label: string;
  value: number;
  unit: string;
};

function MetricCard({
  label,
  value,
  unit,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-2 text-2xl font-semibold">
        {value.toLocaleString()}{" "}
        <span className="text-sm text-slate-400">
          {unit}
        </span>
      </p>
    </div>
  );
}

type NumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function NumberInput({
  label,
  value,
  onChange,
}: NumberInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-300">
        {label}
      </span>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
      />
    </label>
  );
}
