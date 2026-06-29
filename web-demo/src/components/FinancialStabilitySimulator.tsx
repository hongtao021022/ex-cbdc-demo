"use client";

import { useState } from "react";

type BankStatus = "idle" | "stable" | "stress" | "failed";
type LogType = "info" | "success" | "warning" | "error";

type StressResult = {
  availableLiquidity: number;
  remainingLiquidity: number;
  remainingDeposits: number;
  liquidityShortfall: number;
  requiredLiquidity: number;
  regulatoryBuffer: number;
  postStressRatio: number;
  wholesaleFundingUsed: number;
  centralBankFundingUsed: number;
};

type LogEntry = {
  id: string;
  time: string;
  type: LogType;
  message: string;
};

const initialConfiguration = {
  customerDeposits: 1200,
  liquidReserves: 500,
  withdrawalDemand: 600,
  wholesaleFundingCapacity: 200,
  centralBankFacilityCapacity: 300,
  minimumLiquidityRatio: 20,
  wholesaleMarketAvailable: true,
  centralBankSupportEnabled: false,
};

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

function formatNumber(value: number) {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 1,
  });
}

export default function FinancialStabilitySimulator() {
  const [customerDeposits, setCustomerDeposits] = useState(
    initialConfiguration.customerDeposits
  );

  const [liquidReserves, setLiquidReserves] = useState(
    initialConfiguration.liquidReserves
  );

  const [withdrawalDemand, setWithdrawalDemand] = useState(
    initialConfiguration.withdrawalDemand
  );

  const [wholesaleFundingCapacity, setWholesaleFundingCapacity] =
    useState(initialConfiguration.wholesaleFundingCapacity);

  const [centralBankFacilityCapacity, setCentralBankFacilityCapacity] =
    useState(initialConfiguration.centralBankFacilityCapacity);

  const [minimumLiquidityRatio, setMinimumLiquidityRatio] = useState(
    initialConfiguration.minimumLiquidityRatio
  );

  const [wholesaleMarketAvailable, setWholesaleMarketAvailable] =
    useState(initialConfiguration.wholesaleMarketAvailable);

  const [centralBankSupportEnabled, setCentralBankSupportEnabled] =
    useState(initialConfiguration.centralBankSupportEnabled);

  const [status, setStatus] = useState<BankStatus>("idle");

  const [message, setMessage] = useState(
    "Configure the liquidity shock and run the stress test."
  );

  const [result, setResult] = useState<StressResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  function addLog(type: LogType, logMessage: string) {
    const entry = createLogEntry(type, logMessage);

    setLogs((currentLogs) => [entry, ...currentLogs].slice(0, 10));
  }

  function markConfigurationChanged(changeMessage: string) {
    setStatus("idle");
    setResult(null);
    setMessage(changeMessage);
  }

  function runStressTest() {
    addLog(
      "info",
      `Testing a withdrawal shock of ${formatNumber(
        withdrawalDemand
      )} against ${formatNumber(liquidReserves)} in liquid reserves.`
    );

    if (customerDeposits <= 0) {
      const failureMessage =
        "Stress test rejected because customer deposits must be greater than zero.";

      setStatus("failed");
      setResult(null);
      setMessage(failureMessage);
      addLog("error", failureMessage);

      return;
    }

    if (
      liquidReserves < 0 ||
      withdrawalDemand <= 0 ||
      wholesaleFundingCapacity < 0 ||
      centralBankFacilityCapacity < 0
    ) {
      const failureMessage =
        "Stress test rejected because balances and funding capacities cannot be negative, and withdrawal demand must be greater than zero.";

      setStatus("failed");
      setResult(null);
      setMessage(failureMessage);
      addLog("error", failureMessage);

      return;
    }

    if (
      minimumLiquidityRatio < 0 ||
      minimumLiquidityRatio > 100
    ) {
      const failureMessage =
        "Stress test rejected because the minimum liquidity ratio must be between 0% and 100%.";

      setStatus("failed");
      setResult(null);
      setMessage(failureMessage);
      addLog("error", failureMessage);

      return;
    }

    if (withdrawalDemand > customerDeposits) {
      const failureMessage =
        `Stress test rejected because withdrawal demand of ${formatNumber(
          withdrawalDemand
        )} exceeds total customer deposits of ${formatNumber(
          customerDeposits
        )}.`;

      setStatus("failed");
      setResult(null);
      setMessage(failureMessage);
      addLog("error", failureMessage);

      return;
    }

    const wholesaleFundingUsed = wholesaleMarketAvailable
      ? wholesaleFundingCapacity
      : 0;

    const centralBankFundingUsed = centralBankSupportEnabled
      ? centralBankFacilityCapacity
      : 0;

    const availableLiquidity =
      liquidReserves +
      wholesaleFundingUsed +
      centralBankFundingUsed;

    const liquidityShortfall = Math.max(
      withdrawalDemand - availableLiquidity,
      0
    );

    const remainingLiquidity = Math.max(
      availableLiquidity - withdrawalDemand,
      0
    );

    const remainingDeposits = Math.max(
      customerDeposits - withdrawalDemand,
      0
    );

    const requiredLiquidity =
      remainingDeposits * (minimumLiquidityRatio / 100);

    const regulatoryBuffer =
      remainingLiquidity - requiredLiquidity;

    const postStressRatio =
      remainingDeposits === 0
        ? remainingLiquidity > 0
          ? 100
          : 0
        : (remainingLiquidity / remainingDeposits) * 100;

    const nextResult: StressResult = {
      availableLiquidity,
      remainingLiquidity,
      remainingDeposits,
      liquidityShortfall,
      requiredLiquidity,
      regulatoryBuffer,
      postStressRatio,
      wholesaleFundingUsed,
      centralBankFundingUsed,
    };

    setResult(nextResult);

    if (liquidityShortfall > 0) {
      const failureMessage =
        `Bank failure: available liquidity covers only ${formatNumber(
          availableLiquidity
        )} of ${formatNumber(
          withdrawalDemand
        )} in withdrawal demand. The liquidity shortfall is ${formatNumber(
          liquidityShortfall
        )}.`;

      setStatus("failed");
      setMessage(failureMessage);

      addLog(
        "error",
        `Liquidity failure recorded. The bank could not meet ${formatNumber(
          liquidityShortfall
        )} of customer withdrawals.`
      );

      return;
    }

    if (regulatoryBuffer < 0) {
      const stressMessage =
        `Bank remains operational but is under stress. Withdrawals were paid, although post-stress liquidity is ${formatNumber(
          Math.abs(regulatoryBuffer)
        )} below the regulatory requirement.`;

      setStatus("stress");
      setMessage(stressMessage);

      addLog(
        "warning",
        `The bank met all withdrawals but breached the ${formatNumber(
          minimumLiquidityRatio
        )}% minimum liquidity requirement.`
      );

      return;
    }

    const successMessage =
      `Bank remains stable. All withdrawals were paid and the bank retains a regulatory liquidity buffer of ${formatNumber(
        regulatoryBuffer
      )}.`;

    setStatus("stable");
    setMessage(successMessage);

    addLog(
      "success",
      `Stress test passed with a post-stress liquidity ratio of ${formatNumber(
        postStressRatio
      )}%.`
    );
  }

  function resetSimulation() {
    setCustomerDeposits(initialConfiguration.customerDeposits);
    setLiquidReserves(initialConfiguration.liquidReserves);
    setWithdrawalDemand(initialConfiguration.withdrawalDemand);

    setWholesaleFundingCapacity(
      initialConfiguration.wholesaleFundingCapacity
    );

    setCentralBankFacilityCapacity(
      initialConfiguration.centralBankFacilityCapacity
    );

    setMinimumLiquidityRatio(
      initialConfiguration.minimumLiquidityRatio
    );

    setWholesaleMarketAvailable(
      initialConfiguration.wholesaleMarketAvailable
    );

    setCentralBankSupportEnabled(
      initialConfiguration.centralBankSupportEnabled
    );

    setStatus("idle");
    setResult(null);

    setMessage(
      "Configure the liquidity shock and run the stress test."
    );

    setLogs([
      createLogEntry(
        "info",
        "Financial stability simulation reset to its initial banking conditions."
      ),
    ]);
  }

  const emergencyFunding =
    (wholesaleMarketAvailable
      ? wholesaleFundingCapacity
      : 0) +
    (centralBankSupportEnabled
      ? centralBankFacilityCapacity
      : 0);

  return (
    <section
      id="financial-stability"
      className="scroll-mt-8 border-t border-white/10 py-14"
    >
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Interactive prototype
        </p>

        <h2 className="mt-3 text-3xl font-semibold">
          Financial stability stress test
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-slate-400">
          Test whether a commercial bank can withstand concentrated
          customer withdrawals, wholesale funding disruption, and
          regulatory liquidity requirements.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
            Bank balance sheet
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Initial liquidity position
          </h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <MetricCard
              label="Customer deposits"
              value={customerDeposits}
              unit="units"
            />

            <MetricCard
              label="Liquid reserves"
              value={liquidReserves}
              unit="units"
            />

            <MetricCard
              label="Emergency funding"
              value={emergencyFunding}
              unit="units"
            />

            <MetricCard
              label="Withdrawal shock"
              value={withdrawalDemand}
              unit="units"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
            Stress parameters
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Configure the liquidity shock
          </h3>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <NumberInput
              label="Customer deposits"
              value={customerDeposits}
              min={1}
              onChange={(value) => {
                setCustomerDeposits(value);

                markConfigurationChanged(
                  "Customer deposits changed. Run the stress test again."
                );
              }}
            />

            <NumberInput
              label="Liquid reserves"
              value={liquidReserves}
              min={0}
              onChange={(value) => {
                setLiquidReserves(value);

                markConfigurationChanged(
                  "Liquid reserves changed. Run the stress test again."
                );
              }}
            />

            <NumberInput
              label="Withdrawal demand"
              value={withdrawalDemand}
              min={1}
              onChange={(value) => {
                setWithdrawalDemand(value);

                markConfigurationChanged(
                  "Withdrawal demand changed. Run the stress test again."
                );
              }}
            />

            <NumberInput
              label="Minimum liquidity ratio (%)"
              value={minimumLiquidityRatio}
              min={0}
              max={100}
              onChange={(value) => {
                setMinimumLiquidityRatio(value);

                markConfigurationChanged(
                  "Regulatory liquidity requirement changed. Run the stress test again."
                );
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
            Market funding
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Wholesale liquidity access
          </h3>

          <div className="mt-6">
            <FundingToggle
              label="Wholesale funding market"
              description="Allow the bank to raise short-term liquidity from financial markets."
              active={wholesaleMarketAvailable}
              activeLabel="Available"
              inactiveLabel="Frozen"
              activeTone="success"
              onClick={() => {
                const nextValue = !wholesaleMarketAvailable;

                setWholesaleMarketAvailable(nextValue);

                markConfigurationChanged(
                  nextValue
                    ? "Wholesale funding access restored. Run the stress test again."
                    : "Wholesale funding market frozen. Run the stress test again."
                );

                addLog(
                  nextValue ? "info" : "warning",
                  nextValue
                    ? "Wholesale funding access was restored."
                    : "Wholesale funding market access was frozen."
                );
              }}
            />

            <div className="mt-5">
              <NumberInput
                label="Wholesale funding capacity"
                value={wholesaleFundingCapacity}
                min={0}
                disabled={!wholesaleMarketAvailable}
                onChange={(value) => {
                  setWholesaleFundingCapacity(value);

                  markConfigurationChanged(
                    "Wholesale funding capacity changed. Run the stress test again."
                  );
                }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
            Lender of last resort
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Central bank liquidity facility
          </h3>

          <div className="mt-6">
            <FundingToggle
              label="Emergency central bank support"
              description="Provide temporary liquidity when market funding is insufficient."
              active={centralBankSupportEnabled}
              activeLabel="Enabled"
              inactiveLabel="Disabled"
              activeTone="warning"
              onClick={() => {
                const nextValue = !centralBankSupportEnabled;

                setCentralBankSupportEnabled(nextValue);

                markConfigurationChanged(
                  nextValue
                    ? "Central bank support enabled. Run the stress test again."
                    : "Central bank support disabled. Run the stress test again."
                );

                addLog(
                  nextValue ? "warning" : "info",
                  nextValue
                    ? "Emergency central bank liquidity support was enabled."
                    : "Emergency central bank liquidity support was disabled."
                );
              }}
            />

            <div className="mt-5">
              <NumberInput
                label="Central bank facility capacity"
                value={centralBankFacilityCapacity}
                min={0}
                disabled={!centralBankSupportEnabled}
                onChange={(value) => {
                  setCentralBankFacilityCapacity(value);

                  markConfigurationChanged(
                    "Central bank facility capacity changed. Run the stress test again."
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={runStressTest}
          className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Run liquidity stress test
        </button>

        <button
          type="button"
          onClick={resetSimulation}
          className="rounded-lg border border-white/15 px-5 py-3 font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      <div
        className={`mt-6 rounded-2xl border p-5 ${
          status === "stable"
            ? "border-emerald-400/30 bg-emerald-400/10"
            : status === "stress"
              ? "border-amber-400/30 bg-amber-400/10"
              : status === "failed"
                ? "border-red-400/30 bg-red-400/10"
                : "border-white/10 bg-white/[0.04]"
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
              Stress-test result
            </p>

            <p className="mt-2 max-w-4xl leading-7 text-slate-200">
              {message}
            </p>
          </div>

          <StatusBadge status={status} />
        </div>
      </div>

      {result && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ResultCard
            label="Available liquidity"
            value={`${formatNumber(
              result.availableLiquidity
            )} units`}
            description="Reserves plus accessible wholesale and central bank funding."
          />

          <ResultCard
            label="Remaining liquidity"
            value={`${formatNumber(
              result.remainingLiquidity
            )} units`}
            description="Liquidity remaining after customer withdrawals."
          />

          <ResultCard
            label="Post-stress ratio"
            value={`${formatNumber(
              result.postStressRatio
            )}%`}
            description={`Compared with a ${formatNumber(
              minimumLiquidityRatio
            )}% regulatory minimum.`}
          />

          <ResultCard
            label={
              result.liquidityShortfall > 0
                ? "Liquidity shortfall"
                : "Regulatory buffer"
            }
            value={`${formatNumber(
              result.liquidityShortfall > 0
                ? result.liquidityShortfall
                : result.regulatoryBuffer
            )} units`}
            description={
              result.liquidityShortfall > 0
                ? "Customer withdrawals that the bank cannot meet."
                : "Liquidity above or below the regulatory requirement."
            }
            negative={
              result.liquidityShortfall > 0 ||
              result.regulatoryBuffer < 0
            }
          />
        </div>
      )}

      {result && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
            Liquidity composition
          </p>

          <h3 className="mt-2 text-xl font-semibold">
            Funding used during the stress event
          </h3>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <CompositionCard
              label="Initial reserves"
              value={liquidReserves}
            />

            <CompositionCard
              label="Wholesale funding"
              value={result.wholesaleFundingUsed}
            />

            <CompositionCard
              label="Central bank support"
              value={result.centralBankFundingUsed}
            />

            <CompositionCard
              label="Required liquidity"
              value={result.requiredLiquidity}
            />
          </div>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-400">
              Stress-event log
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Financial stability events
            </h3>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
            Latest 10
          </span>
        </div>

        <div className="mt-6 space-y-3">
          {logs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 px-4 py-6 text-sm text-slate-500">
              No stress events yet. Run the simulation to
              generate a financial stability log.
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
        {formatNumber(value)}{" "}
        <span className="text-sm text-slate-400">{unit}</span>
      </p>
    </div>
  );
}

type NumberInputProps = {
  label: string;
  value: number;
  min: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
};

function NumberInput({
  label,
  value,
  min,
  max,
  disabled = false,
  onChange,
}: NumberInputProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-300">
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(event) =>
          onChange(Number(event.target.value))
        }
        className="mt-2 w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
      />
    </label>
  );
}

type FundingToggleProps = {
  label: string;
  description: string;
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  activeTone: "success" | "warning";
  onClick: () => void;
};

function FundingToggle({
  label,
  description,
  active,
  activeLabel,
  inactiveLabel,
  activeTone,
  onClick,
}: FundingToggleProps) {
  const activeClasses =
    activeTone === "success"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      : "border-amber-400/30 bg-amber-400/10 text-amber-300";

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
            : "border-red-400/20 bg-red-400/10 text-red-300"
        }`}
      >
        {active ? activeLabel : inactiveLabel}
      </button>
    </div>
  );
}

type ResultCardProps = {
  label: string;
  value: string;
  description: string;
  negative?: boolean;
};

function ResultCard({
  label,
  value,
  description,
  negative = false,
}: ResultCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm text-slate-400">{label}</p>

      <p
        className={`mt-2 text-2xl font-semibold ${
          negative ? "text-red-300" : "text-slate-100"
        }`}
      >
        {value}
      </p>

      <p className="mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

type CompositionCardProps = {
  label: string;
  value: number;
};

function CompositionCard({
  label,
  value,
}: CompositionCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/50 p-4">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-2 font-semibold text-slate-100">
        {formatNumber(value)} units
      </p>
    </div>
  );
}

type StatusBadgeProps = {
  status: BankStatus;
};

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "stable") {
    return (
      <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
        Stable
      </span>
    );
  }

  if (status === "stress") {
    return (
      <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-300">
        Under Stress
      </span>
    );
  }

  if (status === "failed") {
    return (
      <span className="rounded-full border border-red-400/30 bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-300">
        Failed
      </span>
    );
  }

  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-400">
      Not tested
    </span>
  );
}
