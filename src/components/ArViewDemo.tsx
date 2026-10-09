import React, { useState } from 'react';
import { playClick } from '../sound';

interface ArViewProps {
  onClose: () => void;
}

export const ArViewDemo: React.FC<ArViewProps> = ({ onClose }) => {
  const [selectedLayer, setSelectedLayer] = useState<'all' | 'motherboard' | 'cpu' | 'cooling' | 'ssd'>('all');
  const [explodedView, setExplodedView] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="win-outset w-full max-w-lg p-1 shadow-2xl">
        <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">view_in_ar</span>
            <span>AR_VIEW.EXE — Real-time AR Hardware Configurator</span>
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
          <div className="win-inset bg-black p-3 mb-3 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
            {/* Visual 3D Wireframe Representation */}
            <div className="relative w-48 h-36 border-2 border-green-500/60 bg-green-950/20 rounded p-2 flex flex-col items-center justify-between text-green-400 font-mono text-[10px] shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <div className="w-full flex justify-between border-b border-green-600/50 pb-1">
                <span>[DELL-PRECISION-CHASSIS]</span>
                <span className="animate-pulse">AR: ANCHORED</span>
              </div>

              {/* Exploded Layers Visualization */}
              <div className={`space-y-2 w-full transition-all duration-500 ${explodedView ? 'scale-110 space-y-4' : ''}`}>
                <div
                  className={`p-1 border text-center transition-colors ${
                    selectedLayer === 'cooling' || selectedLayer === 'all'
                      ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                      : 'border-gray-700 text-gray-600'
                  }`}
                >
                  ❄️ VAPOR CHAMBER COOLING UNIT (Dual 12V Fans)
                </div>

                <div
                  className={`p-1 border text-center transition-colors ${
                    selectedLayer === 'cpu' || selectedLayer === 'all'
                      ? 'border-yellow-400 bg-yellow-950/60 text-yellow-200'
                      : 'border-gray-700 text-gray-600'
                  }`}
                >
                  ⚡ XEON W9 ENTERPRISE SOC + ECC MEMORY ARRAY
                </div>

                <div
                  className={`p-1 border text-center transition-colors ${
                    selectedLayer === 'ssd' || selectedLayer === 'all'
                      ? 'border-purple-400 bg-purple-950/60 text-purple-200'
                      : 'border-gray-700 text-gray-600'
                  }`}
                >
                  💾 PCIE GEN5 NVME SSD (8TB RAID-0 ARRAY)
                </div>

                <div
                  className={`p-1 border text-center transition-colors ${
                    selectedLayer === 'motherboard' || selectedLayer === 'all'
                      ? 'border-green-400 bg-green-950/60 text-green-200'
                      : 'border-gray-700 text-gray-600'
                  }`}
                >
                  🟩 14-LAYER MULTI-PCB MOTHERBOARD SUBSTRATE
                </div>
              </div>

              <div className="w-full flex justify-between text-[9px] text-green-500/80 pt-1 border-t border-green-600/50">
                <span>ROTATION: [0°, 24°, -12°]</span>
                <span>FOV: 68°</span>
              </div>
            </div>

            <div className="absolute top-2 right-2 text-green-400 font-mono text-[9px] text-right">
              <div>RENDER: WEBXR</div>
              <div>BUFFERS: 60 FPS</div>
            </div>
          </div>

          {/* Control Bar */}
          <div className="win-inset bg-white p-2 mb-3">
            <div className="text-[11px] font-bold text-gray-800 mb-1">Interactive Layer Inspection:</div>
            <div className="flex flex-wrap gap-1 mb-2">
              <button
                onClick={() => {
                  playClick();
                  setSelectedLayer('all');
                }}
                className={`win-btn px-2 py-0.5 text-xs ${selectedLayer === 'all' ? 'win-btn-pressed font-bold' : ''}`}
              >
                All Components
              </button>
              <button
                onClick={() => {
                  playClick();
                  setSelectedLayer('cooling');
                }}
                className={`win-btn px-2 py-0.5 text-xs ${selectedLayer === 'cooling' ? 'win-btn-pressed font-bold' : ''}`}
              >
                Cooling Layer
              </button>
              <button
                onClick={() => {
                  playClick();
                  setSelectedLayer('cpu');
                }}
                className={`win-btn px-2 py-0.5 text-xs ${selectedLayer === 'cpu' ? 'win-btn-pressed font-bold' : ''}`}
              >
                CPU / RAM
              </button>
              <button
                onClick={() => {
                  playClick();
                  setSelectedLayer('ssd');
                }}
                className={`win-btn px-2 py-0.5 text-xs ${selectedLayer === 'ssd' ? 'win-btn-pressed font-bold' : ''}`}
              >
                Storage
              </button>
              <button
                onClick={() => {
                  playClick();
                  setSelectedLayer('motherboard');
                }}
                className={`win-btn px-2 py-0.5 text-xs ${selectedLayer === 'motherboard' ? 'win-btn-pressed font-bold' : ''}`}
              >
                Motherboard
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-gray-300">
              <button
                onClick={() => {
                  playClick();
                  setExplodedView(!explodedView);
                }}
                className="win-btn px-3 py-1 text-xs font-bold bg-[#008080] text-white"
              >
                {explodedView ? 'Collapse Assembly' : 'Exploded View (Spatial 3D)'}
              </button>
              <span className="text-[10px] text-gray-600 font-mono">
                Built during Dell Technologies Internship & converted to PPO
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="win-btn px-4 py-1 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
