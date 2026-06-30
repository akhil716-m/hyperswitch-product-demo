import React, { useState } from 'react';
import { Activity, ArrowRight, Play, RotateCcw, Zap } from 'lucide-react';

const STAT_CARDS = [
  { label: 'Total failed', value: '1,022', delta: '+12%', sub: 'transactions', tone: 'gray' },
  { label: 'Revenue at risk', value: '$48,960', delta: '+8.4%', sub: 'across failures', tone: 'red' },
  { label: 'Soft declines', value: '745', delta: '-3.2%', sub: '~70% recoverable', tone: 'amber' },
  { label: 'Hard declines', value: '277', delta: '+1.1%', sub: '~5% recoverable', tone: 'gray' },
];

const FAILURE_BREAKDOWN = [
  { reason: 'Insufficient Funds', total: 482, soft: 96, hard: 4, recoverable: 'High' },
  { reason: 'Network Timeout', total: 196, soft: 88, hard: 12, recoverable: 'High' },
  { reason: 'Do Not Honor', total: 174, soft: 60, hard: 40, recoverable: 'Medium' },
  { reason: 'Expired Card', total: 138, soft: 100, hard: 0, recoverable: 'High' },
  { reason: 'Lost/Stolen Card', total: 22, soft: 0, hard: 100, recoverable: 'None' },
  { reason: 'Fraud Detected', total: 10, soft: 0, hard: 100, recoverable: 'None' },
];

const SANDBOX_REGIONS = ['APAC', 'LATAM', 'EU', 'NA'];
const SANDBOX_ISSUERS = ['Chase', 'BofA', 'Wells', 'HSBC'];

const StatCard = ({ label, value, delta, sub, tone }) => {
  const deltaColor = delta.startsWith('-')
    ? 'text-green-600 dark:text-green-400'
    : tone === 'red'
    ? 'text-red-500'
    : 'text-amber-500';
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</span>
        <span className={`text-xs font-medium ${deltaColor}`}>{delta}</span>
      </div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</div>
    </div>
  );
};

const PipelineStage = ({ title, sub, badge, last }) => (
  <div className="flex items-center">
    <div className="min-w-[160px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
      <div className="text-sm font-medium text-gray-900 dark:text-white">{title}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{sub}</div>
      {badge && (
        <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
          {badge}
        </span>
      )}
    </div>
    {!last && <ArrowRight className="w-4 h-4 text-gray-400 mx-2 shrink-0" />}
  </div>
);

const RecoveryDemo = () => {
  const [engineRunning, setEngineRunning] = useState(false);
  const [sandbox, setSandbox] = useState({
    failureClass: 'soft',
    region: 'APAC',
    issuer: 'Chase',
    amount: 480,
  });
  const [simResult, setSimResult] = useState(null);

  const runSimulation = () => {
    const isSoft = sandbox.failureClass === 'soft';
    const recoveryChance = isSoft ? 0.7 : 0.05;
    const recovered = Math.random() < recoveryChance;
    setSimResult({
      recovered,
      window: ['Mon 9a', 'Wed 2p', 'Fri 10a', 'Sun 6p'][Math.floor(Math.random() * 4)],
      confidence: Math.round((recovered ? 0.7 + Math.random() * 0.25 : 0.1 + Math.random() * 0.3) * 100),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Recovery</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Monitor failed payments, classification, and ML-driven retry decisions.
          </p>
        </div>
        <button
          onClick={() => setEngineRunning((r) => !r)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            engineRunning
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {engineRunning ? <Activity className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {engineRunning ? 'Engine running' : 'Start simulation'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_CARDS.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Live recovery pipeline</h3>
        <div className="flex flex-wrap items-center gap-y-3 overflow-x-auto">
          <PipelineStage title="Failed invoice" sub="Stripe · acme.inc" badge="205 failed" />
          <PipelineStage title="Merchant gateway" sub="Outgoing failures" />
          <PipelineStage title="Juspay intake" sub="Receiving failed invoices" badge="Soft / Hard" />
          <PipelineStage title="Recovery ML" sub="Adaptive decisioning" badge={engineRunning ? 'Processing' : 'Idle'} />
          <PipelineStage title="Recovered" sub="Adaptive scoring · 30d window" last />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-x-auto">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Failure breakdown</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="py-2 pr-4">Decline reason</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">% soft</th>
              <th className="py-2 pr-4">% hard</th>
              <th className="py-2 pr-4">Recoverable</th>
            </tr>
          </thead>
          <tbody>
            {FAILURE_BREAKDOWN.map((row) => (
              <tr key={row.reason} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                <td className="py-2 pr-4 text-gray-900 dark:text-white">{row.reason}</td>
                <td className="py-2 pr-4 text-gray-600 dark:text-gray-300">{row.total}</td>
                <td className="py-2 pr-4 text-blue-600 dark:text-blue-400">{row.soft}%</td>
                <td className="py-2 pr-4 text-red-500">{row.hard}%</td>
                <td className="py-2 pr-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      row.recoverable === 'High'
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                        : row.recoverable === 'Medium'
                        ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}
                  >
                    {row.recoverable}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" /> Sandbox: simulate a single invoice
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Failure class</label>
            <select
              value={sandbox.failureClass}
              onChange={(e) => setSandbox((s) => ({ ...s, failureClass: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
            >
              <option value="soft">Soft decline</option>
              <option value="hard">Hard decline</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Region</label>
            <select
              value={sandbox.region}
              onChange={(e) => setSandbox((s) => ({ ...s, region: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
            >
              {SANDBOX_REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Issuer</label>
            <select
              value={sandbox.issuer}
              onChange={(e) => setSandbox((s) => ({ ...s, issuer: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
            >
              {SANDBOX_ISSUERS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Invoice amount</label>
            <input
              type="number"
              value={sandbox.amount}
              onChange={(e) => setSandbox((s) => ({ ...s, amount: Number(e.target.value) }))}
              className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={runSimulation}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-4 h-4" /> Run simulation
          </button>
          <button
            onClick={() => setSimResult(null)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>

        {simResult && (
          <div
            className={`mt-4 p-3 rounded-lg border text-sm ${
              simResult.recovered
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-300'
            }`}
          >
            <span className="font-medium">
              {simResult.recovered ? 'ML pre-decision: retry scheduled' : 'ML pre-decision: no retry'}
            </span>{' '}
            — best window <strong>{simResult.window}</strong>, confidence {simResult.confidence}%.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoveryDemo;
