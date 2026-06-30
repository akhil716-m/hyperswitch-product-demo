import React, { useState } from 'react';
import { Play, RotateCcw, Zap, TrendingUp, TrendingDown } from 'lucide-react';

const ERROR_TYPES = ['Insufficient funds', 'Network timeout', 'Do not honor', 'Expired card', 'Stolen card'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const REGIONS = ['APAC', 'LATAM', 'EU', 'NA'];
const ISSUERS = ['Chase', 'BofA', 'Wells', 'HSBC'];

const RecoverySimulation = () => {
  const [sandbox, setSandbox] = useState({
    failureClass: 'soft',
    errorType: ERROR_TYPES[0],
    day: 'Mon',
    hour: 15,
    region: 'APAC',
    issuer: 'Chase',
    amount: 480,
  });
  const [result, setResult] = useState(null);

  const set = (key) => (e) =>
    setSandbox((s) => ({ ...s, [key]: e.target.type === 'range' ? Number(e.target.value) : e.target.value }));

  const runSimulation = () => {
    const isSoft = sandbox.failureClass === 'soft';
    const recoveryChance = isSoft ? 0.7 : 0.05;
    const recovered = Math.random() < recoveryChance;
    setResult({
      recovered,
      window: `${DAYS[Math.floor(Math.random() * 7)]} ${[9, 10, 14, 18][Math.floor(Math.random() * 4)]}:00`,
      confidence: Math.round((recovered ? 0.7 + Math.random() * 0.25 : 0.1 + Math.random() * 0.3) * 100),
    });
  };

  const reset = () => {
    setSandbox({
      failureClass: 'soft',
      errorType: ERROR_TYPES[0],
      day: 'Mon',
      hour: 15,
      region: 'APAC',
      issuer: 'Chase',
      amount: 480,
    });
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Recovery Simulation</h2>
          <p className="text-sm text-gray-400">
            Configure a single failed invoice and see the ML engine's retry pre-decision.
          </p>
        </div>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-400" /> Sandbox
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">Failure class</label>
            <div className="flex bg-gray-800 rounded-lg p-1">
              {['soft', 'hard'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSandbox((s) => ({ ...s, failureClass: cls }))}
                  className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                    sandbox.failureClass === cls ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Error type</label>
            <select
              value={sandbox.errorType}
              onChange={set('errorType')}
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-white"
            >
              {ERROR_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Day of week</label>
            <select
              value={sandbox.day}
              onChange={set('day')}
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-white"
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Hour of day · {sandbox.hour}:00</label>
            <input
              type="range"
              min="0"
              max="23"
              value={sandbox.hour}
              onChange={set('hour')}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Region</label>
            <select
              value={sandbox.region}
              onChange={set('region')}
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-white"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Issuer</label>
            <select
              value={sandbox.issuer}
              onChange={set('issuer')}
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-white"
            >
              {ISSUERS.map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-xs text-gray-400 mb-1">Invoice amount · ${sandbox.amount}</label>
            <input
              type="number"
              value={sandbox.amount}
              onChange={set('amount')}
              className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-md text-white"
            />
          </div>
        </div>

        <button
          onClick={runSimulation}
          className="mt-5 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play className="w-4 h-4" /> Run simulation
        </button>

        {result && (
          <div
            className={`mt-5 p-4 rounded-lg border text-sm flex items-start gap-3 ${
              result.recovered
                ? 'bg-green-900/20 border-green-800 text-green-300'
                : 'bg-red-900/20 border-red-800 text-red-300'
            }`}
          >
            {result.recovered ? (
              <TrendingUp className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <TrendingDown className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-medium">
                {result.recovered ? 'ML pre-decision: retry scheduled' : 'ML pre-decision: no retry'}
              </div>
              <div className="text-xs opacity-80 mt-1">
                Best window <strong>{result.window}</strong> · confidence {result.confidence}% · {sandbox.errorType} ·{' '}
                {sandbox.issuer} · {sandbox.region}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoverySimulation;
