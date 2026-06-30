import React, { useState } from 'react';
import { Activity, ArrowRight, Play } from 'lucide-react';

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

const StatCard = ({ label, value, delta, sub, tone }) => {
  const deltaColor = delta.startsWith('-')
    ? 'text-green-400'
    : tone === 'red'
    ? 'text-red-500'
    : 'text-amber-500';
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-white">{value}</span>
        <span className={`text-xs font-medium ${deltaColor}`}>{delta}</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">{sub}</div>
    </div>
  );
};

const PipelineStage = ({ title, sub, badge, last }) => (
  <div className="flex items-center">
    <div className="min-w-[160px] bg-gray-900 border border-gray-800 rounded-lg p-3">
      <div className="text-sm font-medium text-white">{title}</div>
      <div className="text-xs text-gray-400">{sub}</div>
      {badge && (
        <span className="inline-block mt-2 text-[11px] px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300">
          {badge}
        </span>
      )}
    </div>
    {!last && <ArrowRight className="w-4 h-4 text-gray-600 mx-2 shrink-0" />}
  </div>
);

const RecoveryOverview = () => {
  const [engineRunning, setEngineRunning] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Recovery Overview</h2>
          <p className="text-sm text-gray-400">
            Monitor failed payments, classification, and ML-driven retry decisions.
          </p>
        </div>
        <button
          onClick={() => setEngineRunning((r) => !r)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            engineRunning
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {engineRunning ? <Activity className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {engineRunning ? 'Engine running' : 'Start recovery simulation'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_CARDS.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-white mb-3">Live recovery pipeline</h3>
        <div className="flex flex-wrap items-center gap-y-3 overflow-x-auto">
          <PipelineStage title="Failed invoice" sub="Stripe · acme.inc" badge="205 failed" />
          <PipelineStage title="Merchant gateway" sub="Outgoing failures" />
          <PipelineStage title="Juspay intake" sub="Receiving failed invoices" badge="Soft / Hard" />
          <PipelineStage title="Recovery ML" sub="Adaptive decisioning" badge={engineRunning ? 'Processing' : 'Idle'} />
          <PipelineStage title="Recovered" sub="Adaptive scoring · 30d window" last />
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto">
        <h3 className="text-sm font-medium text-white mb-3">Failure breakdown</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-800">
              <th className="py-2 pr-4">Decline reason</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2 pr-4">% soft</th>
              <th className="py-2 pr-4">% hard</th>
              <th className="py-2 pr-4">Recoverable</th>
            </tr>
          </thead>
          <tbody>
            {FAILURE_BREAKDOWN.map((row) => (
              <tr key={row.reason} className="border-b border-gray-800/60 last:border-0">
                <td className="py-2 pr-4 text-white">{row.reason}</td>
                <td className="py-2 pr-4 text-gray-300">{row.total}</td>
                <td className="py-2 pr-4 text-blue-400">{row.soft}%</td>
                <td className="py-2 pr-4 text-red-500">{row.hard}%</td>
                <td className="py-2 pr-4">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      row.recoverable === 'High'
                        ? 'bg-green-900/40 text-green-300'
                        : row.recoverable === 'Medium'
                        ? 'bg-amber-900/40 text-amber-300'
                        : 'bg-gray-800 text-gray-500'
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
    </div>
  );
};

export default RecoveryOverview;
