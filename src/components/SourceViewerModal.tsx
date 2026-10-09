import React, { useState } from 'react';
import { playClick, playChord } from '../sound';
import { downloadSourceZip } from '../downloadZip';
import { PROJECT_SOURCE_FILES } from '../projectFiles';

interface SourceViewerModalProps {
  onClose: () => void;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({ onClose }) => {
  const fileKeys = Object.keys(PROJECT_SOURCE_FILES);
  const [selectedFile, setSelectedFile] = useState<string>(fileKeys[0] || 'src/App.tsx');
  const [isZipping, setIsZipping] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    try {
      setIsZipping(true);
      playClick();
      await downloadSourceZip();
      playChord();
    } catch (err) {
      console.error('Failed to create zip', err);
      alert('Could not generate zip client-side: ' + (err as Error).message);
    } finally {
      setIsZipping(false);
    }
  };

  const handleCopyCode = () => {
    const code = PROJECT_SOURCE_FILES[selectedFile] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="win-outset w-full max-w-4xl p-1 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">folder_zip</span>
            <span>Project Source Code Archive & Exporter [100% Client-Side Valid ZIP]</span>
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

        <div className="p-3 bg-[#c0c0c0] flex-1 flex flex-col overflow-hidden gap-3">
          {/* Top Quick Actions Bar */}
          <div className="win-inset bg-white p-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-xs font-bold text-[#000080]">
                Windows 98 Portfolio — Full Repository Bundle
              </div>
              <div className="text-[11px] text-gray-600">
                Generated in-browser using JSZip (valid RFC 1951 Deflate format). Opens cleanly on Mac, Windows & Linux.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={isZipping}
                className="win-btn px-4 py-1.5 font-bold text-xs bg-[#000080] text-white flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-xs">download</span>
                {isZipping ? 'PACKING ZIP...' : 'DOWNLOAD .ZIP ARCHIVE'}
              </button>

              <button
                onClick={handleCopyCode}
                className="win-btn px-3 py-1.5 text-xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">content_copy</span>
                {copied ? 'Copied File!' : 'Copy Current File'}
              </button>
            </div>
          </div>

          {/* Main Code & Files Split Pane */}
          <div className="flex-1 flex flex-col md:flex-row gap-2 min-h-0">
            {/* File List */}
            <div className="w-full md:w-56 win-inset bg-white p-1 overflow-y-auto font-mono text-xs max-h-48 md:max-h-full">
              <div className="text-[10px] font-bold uppercase text-gray-500 px-2 py-1 bg-gray-100 border-b">
                Project Files ({fileKeys.length})
              </div>
              {fileKeys.map((file) => (
                <div
                  key={file}
                  onClick={() => {
                    playClick();
                    setSelectedFile(file);
                  }}
                  className={`px-2 py-1 cursor-pointer truncate text-[11px] flex items-center gap-1 ${
                    selectedFile === file
                      ? 'bg-[#000080] text-white font-bold'
                      : 'hover:bg-gray-100 text-black'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">
                    {file.endsWith('.tsx') || file.endsWith('.ts') ? 'code' : 'description'}
                  </span>
                  <span>{file}</span>
                </div>
              ))}
            </div>

            {/* Code Preview Pane */}
            <div className="flex-1 win-inset bg-black text-green-400 p-2 font-mono text-xs overflow-auto select-text flex flex-col">
              <div className="text-[10px] text-gray-400 pb-1 mb-1 border-b border-gray-700 flex justify-between">
                <span>FILE: {selectedFile}</span>
                <span>{PROJECT_SOURCE_FILES[selectedFile]?.length || 0} bytes</span>
              </div>
              <pre className="flex-1 overflow-auto whitespace-pre font-mono text-[11px] leading-snug">
                {PROJECT_SOURCE_FILES[selectedFile] || ''}
              </pre>
            </div>
          </div>

          {/* Footer Info */}
          <div className="win-inset-gray p-2 text-[10px] font-mono text-gray-800 flex justify-between items-center">
            <span>Target Repo: https://github.com/naman-ked/webd</span>
            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="win-btn px-4 py-0.5 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
