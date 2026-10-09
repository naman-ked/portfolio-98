import React, { useState } from 'react';
import { playClick } from '../sound';

interface StartMenuProps {
  onClose: () => void;
  onOpenApp: (appId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  currentTheme: string;
  onSelectTheme: (theme: string) => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({
  onClose,
  onOpenApp,
  soundEnabled,
  onToggleSound,
  crtEnabled,
  onToggleCrt,
  currentTheme,
  onSelectTheme,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const handleItemClick = (action: () => void) => {
    playClick();
    action();
    onClose();
  };

  return (
    <div
      className="fixed bottom-10 left-1 z-50 flex shadow-2xl win-outset select-none text-xs"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Windows 98 Vertical Brand Strip */}
      <div className="w-8 bg-gradient-to-t from-[#000080] via-[#1084d0] to-[#000080] flex items-end justify-center pb-3 text-white font-bold tracking-widest">
        <span
          className="transform -rotate-90 origin-bottom-left text-sm whitespace-nowrap text-white font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
          style={{ width: '130px', transformOrigin: '0 0', transform: 'rotate(-90deg) translate(-140px, 6px)' }}
        >
          <span className="font-extrabold text-gray-200">Windows</span> 98
        </span>
      </div>

      {/* Main Start Menu Items */}
      <div className="w-56 bg-[#c0c0c0] py-1 flex flex-col text-black relative">
        {/* Programs */}
        <div
          className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center justify-between cursor-pointer group"
          onMouseEnter={() => setActiveSubmenu('programs')}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-yellow-600 group-hover:text-white">
              folder
            </span>
            <span className="font-medium">Programs</span>
          </div>
          <span className="text-[10px]">▶</span>
        </div>

        {/* Documents */}
        <div
          className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center justify-between cursor-pointer group"
          onMouseEnter={() => setActiveSubmenu('documents')}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-blue-700 group-hover:text-white">
              description
            </span>
            <span className="font-medium">Documents</span>
          </div>
          <span className="text-[10px]">▶</span>
        </div>

        {/* Settings */}
        <div
          className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center justify-between cursor-pointer group"
          onMouseEnter={() => setActiveSubmenu('settings')}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-gray-700 group-hover:text-white">
              settings
            </span>
            <span className="font-medium">Settings</span>
          </div>
          <span className="text-[10px]">▶</span>
        </div>

        <div className="border-t border-[#808080] border-b border-white my-1" />

        {/* Direct shortcuts */}
        <div
          className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer group"
          onClick={() => handleItemClick(() => onOpenApp('terminal'))}
        >
          <span className="material-symbols-outlined text-base text-black group-hover:text-white">
            terminal
          </span>
          <span>MS-DOS Prompt</span>
        </div>

        <div
          className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer group"
          onClick={() => handleItemClick(() => onOpenApp('spinwheel'))}
        >
          <span className="material-symbols-outlined text-base text-red-600 group-hover:text-white">
            rotate_right
          </span>
          <span>SpinWheel.js Physics</span>
        </div>

        <div
          className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer group"
          onClick={() => handleItemClick(() => onOpenApp('portal'))}
        >
          <span className="material-symbols-outlined text-base text-[#000080] group-hover:text-white">
            hub
          </span>
          <span>GitHub Repo Portal</span>
        </div>

        <div
          className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer group"
          onClick={() => handleItemClick(() => onOpenApp('minesweeper'))}
        >
          <span className="material-symbols-outlined text-base text-red-700 group-hover:text-white">
            bomb
          </span>
          <span>Minesweeper</span>
        </div>

        <div
          className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer group text-black"
          onClick={() => handleItemClick(() => onOpenApp('sourceViewer'))}
        >
          <span className="material-symbols-outlined text-base text-amber-700 group-hover:text-white">
            folder_zip
          </span>
          <span>Export Source (.ZIP & Files)</span>
        </div>

        <div className="border-t border-[#808080] border-b border-white my-1" />

        <div
          className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer group"
          onClick={() => handleItemClick(() => onOpenApp('contact'))}
        >
          <span className="material-symbols-outlined text-base text-green-700 group-hover:text-white">
            mail
          </span>
          <span>Connect / Contact</span>
        </div>

        <div
          className="px-3 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer group"
          onClick={() => handleItemClick(() => onOpenApp('shutdown'))}
        >
          <span className="material-symbols-outlined text-base text-red-600 group-hover:text-white">
            power_settings_new
          </span>
          <span>Shut Down...</span>
        </div>
      </div>

      {/* Submenu: Programs */}
      {activeSubmenu === 'programs' && (
        <div
          className="absolute left-[260px] top-0 w-52 bg-[#c0c0c0] win-outset py-1 flex flex-col shadow-xl"
          onMouseEnter={() => setActiveSubmenu('programs')}
        >
          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center gap-2"
            onClick={() => handleItemClick(() => onOpenApp('spinwheel'))}
          >
            <span className="material-symbols-outlined text-sm">rotate_right</span>
            <span>SpinWheel Canvas</span>
          </div>
          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center gap-2"
            onClick={() => handleItemClick(() => onOpenApp('portal'))}
          >
            <span className="material-symbols-outlined text-sm">hub</span>
            <span>Portal.exe Scaffolder</span>
          </div>
          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center gap-2"
            onClick={() => handleItemClick(() => onOpenApp('arview'))}
          >
            <span className="material-symbols-outlined text-sm">view_in_ar</span>
            <span>AR_View Hardware</span>
          </div>
          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center gap-2"
            onClick={() => handleItemClick(() => onOpenApp('minesweeper'))}
          >
            <span className="material-symbols-outlined text-sm">bomb</span>
            <span>Minesweeper</span>
          </div>
          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center gap-2"
            onClick={() => handleItemClick(() => onOpenApp('terminal'))}
          >
            <span className="material-symbols-outlined text-sm">terminal</span>
            <span>MS-DOS Prompt</span>
          </div>
        </div>
      )}

      {/* Submenu: Documents */}
      {activeSubmenu === 'documents' && (
        <div
          className="absolute left-[260px] top-6 w-52 bg-[#c0c0c0] win-outset py-1 flex flex-col shadow-xl"
          onMouseEnter={() => setActiveSubmenu('documents')}
        >
          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center gap-2"
            onClick={() => handleItemClick(() => onOpenApp('experience'))}
          >
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>Experience.log</span>
          </div>
          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center gap-2"
            onClick={() => handleItemClick(() => onOpenApp('projects'))}
          >
            <span className="material-symbols-outlined text-sm">folder_special</span>
            <span>Projects.dir</span>
          </div>
          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center gap-2"
            onClick={() => handleItemClick(() => onOpenApp('academics'))}
          >
            <span className="material-symbols-outlined text-sm">school</span>
            <span>Honors.doc</span>
          </div>
          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center gap-2"
            onClick={() => handleItemClick(() => onOpenApp('hero'))}
          >
            <span className="material-symbols-outlined text-sm">laptop_mac</span>
            <span>BIO_V98.EXE</span>
          </div>
        </div>
      )}

      {/* Submenu: Settings */}
      {activeSubmenu === 'settings' && (
        <div
          className="absolute left-[260px] top-12 w-60 bg-[#c0c0c0] win-outset py-1 flex flex-col shadow-xl"
          onMouseEnter={() => setActiveSubmenu('settings')}
        >
          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center justify-between"
            onClick={() => {
              playClick();
              onToggleSound();
            }}
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">volume_up</span>
              <span>Sound Effects</span>
            </span>
            <span className="font-bold">{soundEnabled ? '✓ ON' : 'OFF'}</span>
          </div>

          <div
            className="px-3 py-1.5 hover:bg-[#000080] hover:text-white cursor-pointer flex items-center justify-between"
            onClick={() => {
              playClick();
              onToggleCrt();
            }}
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">tv</span>
              <span>CRT Scanlines</span>
            </span>
            <span className="font-bold">{crtEnabled ? '✓ ON' : 'OFF'}</span>
          </div>

          <div className="border-t border-[#808080] my-1" />
          <div className="px-3 py-1 text-[11px] font-bold text-gray-700">Desktop Wallpaper Color:</div>
          {[
            { id: 'teal', label: 'Classic Win98 Teal (#008080)' },
            { id: 'navy', label: 'Windows 95 Navy (#000080)' },
            { id: 'matrix', label: 'CRT Matrix Green (#003311)' },
            { id: 'slate', label: 'Enterprise Slate (#2f4f4f)' },
          ].map((theme) => (
            <div
              key={theme.id}
              className={`px-3 py-1 text-[11px] hover:bg-[#000080] hover:text-white cursor-pointer flex items-center justify-between ${
                currentTheme === theme.id ? 'font-bold bg-gray-300' : ''
              }`}
              onClick={() => {
                playClick();
                onSelectTheme(theme.id);
              }}
            >
              <span>{theme.label}</span>
              {currentTheme === theme.id && <span>✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
