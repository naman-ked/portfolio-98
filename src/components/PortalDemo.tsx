import React, { useState } from 'react';
import { playClick, playAlert, playChord } from '../sound';

interface PortalDemoProps {
  onClose: () => void;
}

export const PortalDemo: React.FC<PortalDemoProps> = ({ onClose }) => {
  const [repoName, setRepoName] = useState('react-mfe-template');
  const [tier, setTier] = useState('enterprise-tier');
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '> PORTAL.EXE v2.4 initialized.',
    '> Connected to GitHub Enterprise Server (api.github.internal).',
    '> Ready to scaffold compliance-grade repository with automated CI/CD.'
  ]);
  const [completed, setCompleted] = useState(false);

  const handleProvision = () => {
    if (isProvisioning || !repoName.trim()) return;
    playClick();
    setIsProvisioning(true);
    setCompleted(false);

    const steps = [
      `[1/5] Validating naming convention "${repoName}"... OK`,
      `[2/5] Creating org repository dell/${repoName} via GitHub API... 201 Created`,
      `[3/5] Injecting Branch Protection rules (Require PR, 2 approvals, SonarQube pass)... OK`,
      `[4/5] Provisioning Jenkins & GitHub Actions CI/CD webhooks... Active`,
      `[5/5] Injecting ESLint, Vite 6 config & CODEOWNERS... Ready!`,
      `>>> Repository setup complete in 28.4s! Developer self-service audit logged.`
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, step]);
        if (index === steps.length - 1) {
          setIsProvisioning(false);
          setCompleted(true);
          playChord();
        } else {
          playClick();
        }
      }, (index + 1) * 700);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="win-outset w-full max-w-lg p-1 shadow-2xl">
        <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">hub</span>
            <span>PORTAL.EXE — Automated GitHub Project Portal (Dell Technologies)</span>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
          >
            ✕
          </button>
        </div>

        <div className="p-3 bg-[#c0c0c0]">
          <div className="win-inset bg-white p-3 mb-3">
            <div className="text-xs font-bold text-[#000080] mb-2 border-b border-gray-300 pb-1 flex justify-between">
              <span>REPOSITORY SELF-SERVICE WIZARD</span>
              <span className="text-[10px] text-gray-500 font-mono">EST. TIME: ~30s</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                  Target Repository Name:
                </label>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-gray-500 text-xs">dell/</span>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    disabled={isProvisioning}
                    className="win-inset px-2 py-1 text-xs w-full font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                    Security Level:
                  </label>
                  <select
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    disabled={isProvisioning}
                    className="win-inset w-full px-1 py-1 text-xs outline-none bg-white font-mono"
                  >
                    <option value="enterprise-tier">Tier-1 Enterprise (Strict)</option>
                    <option value="standard">Standard Web Pod</option>
                    <option value="experimental">Labs / Experimental</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-0.5">
                    Pre-configured Stack:
                  </label>
                  <div className="win-inset-gray px-2 py-1 text-xs font-mono text-gray-800">
                    React 19 + TypeScript + Vite
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={handleProvision}
                disabled={isProvisioning}
                className="win-btn px-4 py-1.5 font-bold text-xs bg-[#000080] text-white flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">play_arrow</span>
                {isProvisioning ? 'PROVISIONING...' : 'EXECUTE AUTOMATED SPINUP'}
              </button>

              <button
                onClick={() => {
                  playAlert();
                  setLogs(['> Console buffer flushed. Ready.']);
                }}
                disabled={isProvisioning}
                className="win-btn px-3 py-1.5 text-xs"
              >
                Clear Log
              </button>
            </div>
          </div>

          {/* Console Output */}
          <div className="win-inset bg-black text-green-400 p-2 font-mono text-[11px] h-40 overflow-y-auto mb-2 border border-gray-700 select-text">
            {logs.map((log, i) => (
              <div key={i} className="leading-tight mb-1">
                {log}
              </div>
            ))}
            {isProvisioning && (
              <div className="animate-pulse text-yellow-300">
                ⏳ Processing API requests across GitHub & Sonar...
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-gray-600 text-[10px]">
              Status: {completed ? '✅ Verified in Prod' : isProvisioning ? '⚙️ In Progress' : 'Idle'}
            </span>
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="win-btn px-4 py-1"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
