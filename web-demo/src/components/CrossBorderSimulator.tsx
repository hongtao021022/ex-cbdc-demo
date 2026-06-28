"use client";

import { useState } from "react";

type SettlementStatus = "idle" | "success" | "failed";

const initialBalances = {
  bankAUsd: 100,
  bankAEur: 0,
  bankBUsd: 0,
  bankBEur: 100,
};

export default function CrossBorderSimulator() {
  const [bankAUsd, setBankAUsd] = useState(initialBalances.bankAUsd);
  const [bankAEur, setBankAEur] = useState(initialBalances.bankAEur);
  const [bankBUsd, setBankBUsd] = useState(initialBalances.bankBUsd);
  const [bankBEur, setBankBEur] = useState(initialBalances.bankBEur);

  const [usdAmount, setUsdAmount] = useState(120);
  const [eurAmount, setEurAmount] = useState(100);

  const [status, setStatus] = useState<SettlementStatus>("idle");
  const [message, setMessage] = useState(
    "Configure the transaction and run the settlement."
  );

  function runSettlement() {
    if (usdAmount <= 0 || eurAmount <= 0) {
      setStatus("failed");
      setMessage("Transaction amounts must be greater than zero.");
      return;
    }

    const bankAHasEnoughUsd = bankAUsd >= usdAmount;
    const bankBHasEnoughEur = bankBEur >= eurAmount;

    if (!bankAHasEnoughUsd || !bankBHasEnoughEur) {
      const reasons: string[] = [];

      if (!bankAHasEnoughUsd) {
        reasons.push(
          `Bank A requires ${usdAmount} USD but only holds ${bankAUsd} USD`
        );
      }

      if (!bankBHasEnoughEur) {
        reasons.push(
          `Bank B requires ${eurAmount} EUR but only holds ${bankBEur} EUR`
        );
      }

      setStatus("failed");
      setMessage(
        `Atomic settlement failed. ${reasons.join(
          ". "
        )}. No balances were changed.`
      );

      return;
    }

    setBankAUsd((current) => current - usdAmount);
    setBankAEur((current) => current + eurAmount);

    setBankBUsd((current) => current + usdAmount);
    setBankBEur((current) => current - eurAmount);

    setStatus("success");
    setMessage(
      `Settlement completed atomically: Bank A delivered ${usdAmount} USD and Bank B delivered ${eurAmount} EUR.`
    );
  }

  function resetSimulation() {
    setBankAUsd(initialBalances.bankAUsd);
    setBankAEur(initialBalances.bankAEur);
    setBankBUsd(initialBalances.bankBUsd);
    setBankBEur(initialBalances.bankBEur);

    setUsdAmount(120);
    setEurAmount(100);

    setStatus("idle");
    setMessage("Configure the transaction and run the settlement.");
  }

  return (
    <section className="border-t border-white/10 py-14">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Interactive prototype
        </p>

        <h2 className="mt-3 text-3xl font-semibold">
          Cross-border PvP settlement
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          Bank A exchanges US dollars for Bank B&apos;s euros. Both payment
          legs must succeed together. If either bank lacks liquidity, the
          complete transaction is rejected.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-semibold">Current balances</h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <BalanceCard
              institution="Bank A"
              currency="USD"
              amount={bankAUsd}
            />

            <BalanceCard
              institution="Bank A"
              currency="EUR"
              amount={bankAEur}
            />

            <BalanceCard
              institution="Bank B"
              currency="USD"
              amount={bankBUsd}
            />

            <BalanceCard
              institution="Bank B"
              currency="EUR"
              amount={bankBEur}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <h3 className="text-lg font-semibold">Transaction proposal</h3>

          <div className="mt-6 space-y-5">
            <NumberInput
              label="Bank A delivers USD"
              value={usdAmount}
              onChange={setUsdAmount}
            />

            <NumberInput
              label="Bank B delivers EUR"
              value={eurAmount}
              onChange={setEurAmount}
            />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={runSettlement}
              className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Run atomic settlement
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
          Settlement result
        </p>

        <p className="mt-2 leading-7 text-slate-200">{message}</p>
      </div>
    </section>
  );
}

type BalanceCardProps = {
  institution: string;
  currency: string;
  amount: number;
};

function BalanceCard({
  institution,
  currency,
  amount,
}: BalanceCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
      <p className="text-sm text-slate-400">{institution}</p>

      <p className="mt-2 text-2xl font-semibold">
        {amount.toLocaleString()}{" "}
        <span className="text-sm text-slate-400">{currency}</span>
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
      <span className="text-sm font-medium text-slate-300">{label}</span>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
      />
    </label>
  );
}
