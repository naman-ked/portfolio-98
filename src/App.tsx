/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  playClick,
  playWindowOpen,
  playMinimize,
  playAlert,
  playChord,
  isMuted,
  toggleMute,
} from './sound';
import { SpinWheelDemo } from './components/SpinWheelDemo';
import { PortalDemo } from './components/PortalDemo';
import { ArViewDemo } from './components/ArViewDemo';
import { Minesweeper } from './components/Minesweeper';
import { TerminalPrompt } from './components/TerminalPrompt';
import { StartMenu } from './components/StartMenu';
import { SourceViewerModal } from './components/SourceViewerModal';
import { downloadSourceZip } from './downloadZip';

type WindowId = 'hero' | 'experience' | 'projects' | 'academics' | 'contact';
type ModalApp = 'spinwheel' | 'portal' | 'arview' | 'minesweeper' | 'terminal' | 'shutdown' | 'directNote' | 'sourceViewer';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'teal' | 'navy' | 'matrix' | 'slate'>('teal');
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Experience window tab
  const [expTab, setExpTab] = useState<'thoughtspot' | 'dell-ft' | 'dell-intern' | 'freelance'>('thoughtspot');

  // Start menu state
  const [startMenuOpen, setStartMenuOpen] = useState(false);

  // Active modal app
  const [activeModal, setActiveModal] = useState<ModalApp | null>(null);

  // Clipboard copy feedback
  const [emailCopied, setEmailCopied] = useState(false);

  // Windows visibility (minimized or open)
  const [minimizedWindows, setMinimizedWindows] = useState<Record<WindowId, boolean>>({
    hero: false,
    experience: false,
    projects: false,
    academics: false,
    contact: false,
  });

  // Selected desktop icon
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState<string | null>(null);

  // Live system clock
  const [clockTime, setClockTime] = useState('');

  // Contact quick message note state
  const [noteSender, setNoteSender] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteSent, setNoteSent] = useState(false);

  // Shutdown state
  const [isShutDown, setIsShutDown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setClockTime(`${String(hours).padStart(2, '0')}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync body background color with theme
  useEffect(() => {
    const themeColors: Record<string, string> = {
      teal: '#008080',
      navy: '#000080',
      matrix: '#032612',
      slate: '#2c3e50',
    };
    document.body.style.backgroundColor = themeColors[theme] || '#008080';
  }, [theme]);

  const scrollToWindow = (id: WindowId) => {
    playClick();
    if (minimizedWindows[id]) {
      setMinimizedWindows((prev) => ({ ...prev, [id]: false }));
    }
    const element = document.getElementById(`${id}-window`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleWindowMinimize = (id: WindowId) => {
    setMinimizedWindows((prev) => {
      const nextState = !prev[id];
      if (nextState) {
        playMinimize();
      } else {
        playWindowOpen();
      }
      return { ...prev, [id]: nextState };
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('nkedia1234@gmail.com');
    setEmailCopied(true);
    playChord();
    setTimeout(() => {
      setEmailCopied(false);
    }, 2500);
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteBody.trim()) return;
    playChord();
    setNoteSent(true);
    setTimeout(() => {
      setNoteSent(false);
      setNoteBody('');
      setNoteSender('');
      setActiveModal(null);
    }, 2000);
  };

  const handleSoundToggle = () => {
    const muted = toggleMute();
    setSoundEnabled(!muted);
  };

  if (isShutDown) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 select-none font-mono">
        <div className="text-orange-500 text-3xl font-bold mb-4 tracking-widest animate-pulse">
          It's now safe to turn off your computer.
        </div>
        <div className="text-gray-400 text-sm mb-8">
          Microsoft Windows 98 has halted system activity.
        </div>
        <button
          onClick={() => {
            setIsShutDown(false);
            playChord();
          }}
          className="win-btn px-6 py-2 text-sm font-bold bg-[#c0c0c0] text-black"
        >
          🔄 Restart Computer
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-black flex flex-col justify-between selection:bg-[#000080] selection:text-white pb-14 relative"
      onClick={() => {
        if (startMenuOpen) setStartMenuOpen(false);
        setSelectedDesktopIcon(null);
      }}
    >
      {/* CRT Scanline Filter Overlay */}
      {crtEnabled && <div className="crt-overlay fixed inset-0" />}

      {/* ==================== DESKTOP WORKSPACE ==================== */}
      <div className="w-full max-w-7xl mx-auto px-2 md:px-6 pt-4 pb-16 flex flex-col lg:flex-row gap-5 items-start relative z-10">
        
        {/* DESKTOP ICONS COLUMN */}
        <aside
          className="w-full lg:w-28 shrink-0 flex flex-row lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-visible py-1 px-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* My Computer */}
          <div
            className={`desktop-icon flex flex-col items-center text-center p-1.5 rounded cursor-pointer group text-white decoration-none w-20 shrink-0 ${
              selectedDesktopIcon === 'hero' ? 'selected' : ''
            }`}
            onClick={() => {
              playClick();
              setSelectedDesktopIcon('hero');
            }}
            onDoubleClick={() => scrollToWindow('hero')}
          >
            <div className="w-10 h-10 win-outset flex items-center justify-center bg-[#c0c0c0] shadow mb-1">
              <span className="material-symbols-outlined text-2xl text-[#000080]">computer</span>
            </div>
            <span className="text-[11px] font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-[#008080]/80 group-hover:bg-[#000080] px-1">
              My Computer
            </span>
          </div>

          {/* Experience.log */}
          <div
            className={`desktop-icon flex flex-col items-center text-center p-1.5 rounded cursor-pointer group text-white decoration-none w-20 shrink-0 ${
              selectedDesktopIcon === 'experience' ? 'selected' : ''
            }`}
            onClick={() => {
              playClick();
              setSelectedDesktopIcon('experience');
            }}
            onDoubleClick={() => scrollToWindow('experience')}
          >
            <div className="w-10 h-10 win-outset flex items-center justify-center bg-[#c0c0c0] shadow mb-1">
              <span className="material-symbols-outlined text-2xl text-[#008080]">badge</span>
            </div>
            <span className="text-[11px] font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-[#008080]/80 group-hover:bg-[#000080] px-1">
              Experience.log
            </span>
          </div>

          {/* Projects.dir */}
          <div
            className={`desktop-icon flex flex-col items-center text-center p-1.5 rounded cursor-pointer group text-white decoration-none w-20 shrink-0 ${
              selectedDesktopIcon === 'projects' ? 'selected' : ''
            }`}
            onClick={() => {
              playClick();
              setSelectedDesktopIcon('projects');
            }}
            onDoubleClick={() => scrollToWindow('projects')}
          >
            <div className="w-10 h-10 win-outset flex items-center justify-center bg-[#c0c0c0] shadow mb-1">
              <span className="material-symbols-outlined text-2xl text-[#c49000]">folder_special</span>
            </div>
            <span className="text-[11px] font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-[#008080]/80 group-hover:bg-[#000080] px-1">
              Projects.dir
            </span>
          </div>

          {/* Honors.doc */}
          <div
            className={`desktop-icon flex flex-col items-center text-center p-1.5 rounded cursor-pointer group text-white decoration-none w-20 shrink-0 ${
              selectedDesktopIcon === 'academics' ? 'selected' : ''
            }`}
            onClick={() => {
              playClick();
              setSelectedDesktopIcon('academics');
            }}
            onDoubleClick={() => scrollToWindow('academics')}
          >
            <div className="w-10 h-10 win-outset flex items-center justify-center bg-[#c0c0c0] shadow mb-1">
              <span className="material-symbols-outlined text-2xl text-[#800080]">school</span>
            </div>
            <span className="text-[11px] font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-[#008080]/80 group-hover:bg-[#000080] px-1">
              Honors.doc
            </span>
          </div>

          {/* Connect.msg */}
          <div
            className={`desktop-icon flex flex-col items-center text-center p-1.5 rounded cursor-pointer group text-white decoration-none w-20 shrink-0 ${
              selectedDesktopIcon === 'contact' ? 'selected' : ''
            }`}
            onClick={() => {
              playClick();
              setSelectedDesktopIcon('contact');
            }}
            onDoubleClick={() => scrollToWindow('contact')}
          >
            <div className="w-10 h-10 win-outset flex items-center justify-center bg-[#c0c0c0] shadow mb-1">
              <span className="material-symbols-outlined text-2xl text-[#008000]">mail</span>
            </div>
            <span className="text-[11px] font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-[#008080]/80 group-hover:bg-[#000080] px-1">
              Connect.msg
            </span>
          </div>

          {/* MS-DOS Prompt shortcut */}
          <div
            className="desktop-icon flex flex-col items-center text-center p-1.5 rounded cursor-pointer group text-white decoration-none w-20 shrink-0"
            onClick={() => {
              playClick();
              setActiveModal('terminal');
            }}
          >
            <div className="w-10 h-10 win-outset flex items-center justify-center bg-[#c0c0c0] shadow mb-1">
              <span className="material-symbols-outlined text-2xl text-black">terminal</span>
            </div>
            <span className="text-[11px] font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-[#008080]/80 group-hover:bg-[#000080] px-1">
              MS-DOS Prompt
            </span>
          </div>

          {/* Internet Explorer */}
          <a
            className="desktop-icon flex flex-col items-center text-center p-1.5 rounded cursor-pointer group text-white decoration-none w-20 shrink-0"
            href="https://github.com/ked27"
            rel="noopener noreferrer"
            target="_blank"
            onClick={() => playClick()}
          >
            <div className="w-10 h-10 win-outset flex items-center justify-center bg-[#c0c0c0] shadow mb-1">
              <span className="material-symbols-outlined text-2xl text-[#000080]">language</span>
            </div>
            <span className="text-[11px] font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-[#008080]/80 group-hover:bg-[#000080] px-1">
              Internet Explorer
            </span>
          </a>

          {/* Download Source Code (.zip) */}
          <div
            className="desktop-icon flex flex-col items-center text-center p-1.5 rounded cursor-pointer group text-white decoration-none w-20 shrink-0"
            onClick={async () => {
              playChord();
              try {
                await downloadSourceZip();
              } catch (err) {
                console.error(err);
                setActiveModal('sourceViewer');
              }
            }}
            onDoubleClick={() => setActiveModal('sourceViewer')}
            title="Click to download guaranteed .ZIP or Double-click to browse files"
          >
            <div className="w-10 h-10 win-outset flex items-center justify-center bg-[#c0c0c0] shadow mb-1">
              <span className="material-symbols-outlined text-2xl text-[#b22222]">folder_zip</span>
            </div>
            <span className="text-[11px] font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] bg-[#008080]/80 group-hover:bg-[#000080] px-1">
              Source.zip
            </span>
          </div>

          {/* Recycle Bin */}
          <div
            className="hidden lg:flex flex-col items-center text-center p-1.5 rounded text-white/70 w-20 shrink-0 cursor-pointer group"
            onClick={() => {
              playAlert();
              alert('Recycle Bin is empty. No dropped packets found.');
            }}
          >
            <div className="w-10 h-10 win-outset flex items-center justify-center bg-[#c0c0c0] shadow mb-1 opacity-75">
              <span className="material-symbols-outlined text-2xl text-gray-700">delete</span>
            </div>
            <span className="text-[11px] font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] group-hover:bg-[#000080] px-1">
              Recycle Bin
            </span>
          </div>
        </aside>

        {/* MAIN WINDOWS STACK CONTAINER */}
        <main className="flex-1 w-full flex flex-col gap-6">

          {/* ==================== WINDOW 1: HERO & ABOUT / BIO_V98.EXE ==================== */}
          {!minimizedWindows.hero && (
            <section className="win-outset w-full p-1" id="hero-window">
              {/* Titlebar */}
              <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">laptop_mac</span>
                  <span className="tracking-wide">Naman Kedia [SMTS — FE Infra] - Portfolio 98</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleWindowMinimize('hero')}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                    title="Minimize"
                  >
                    _
                  </button>
                  <button
                    onClick={() => playClick()}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                    title="Maximize"
                  >
                    □
                  </button>
                  <button
                    onClick={() => toggleWindowMinimize('hero')}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Menu Bar */}
              <div className="bg-[#c0c0c0] px-2 py-1 text-xs border-b border-[#808080] flex items-center gap-4 text-black select-none">
                <span
                  className="cursor-pointer hover:bg-[#000080] hover:text-white px-1"
                  onClick={() => {
                    playClick();
                    alert('Naman Kedia Portfolio 98\nBuilt with React, Vite & Tailwind CSS.');
                  }}
                >
                  <span className="underline">F</span>ile
                </span>
                <span
                  className="cursor-pointer hover:bg-[#000080] hover:text-white px-1"
                  onClick={() => {
                    playClick();
                    handleCopyEmail();
                  }}
                >
                  <span className="underline">E</span>dit
                </span>
                <span
                  className="cursor-pointer hover:bg-[#000080] hover:text-white px-1"
                  onClick={() => {
                    playClick();
                    setCrtEnabled(!crtEnabled);
                  }}
                >
                  <span className="underline">V</span>iew
                </span>
                <span
                  className="cursor-pointer hover:bg-[#000080] hover:text-white px-1"
                  onClick={() => {
                    playClick();
                    setActiveModal('terminal');
                  }}
                >
                  <span className="underline">T</span>ools
                </span>
                <span
                  className="cursor-pointer hover:bg-[#000080] hover:text-white px-1"
                  onClick={() => {
                    playClick();
                    alert('Windows 98 Help Center\nExplore Naman Kedia\'s projects, experience, and academic honors.');
                  }}
                >
                  <span className="underline">H</span>elp
                </span>
                <span className="text-[#808080] ml-auto hidden sm:inline text-[11px] font-mono">
                  C:\NAMAN\BIO_V98.EXE
                </span>
              </div>

              {/* Window Body */}
              <div className="p-3 bg-[#c0c0c0]">
                <div className="flex flex-col lg:flex-row gap-4 items-stretch">
                  
                  {/* Left Column: Information */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="win-inset bg-white p-4 mb-3">
                      <div className="flex flex-wrap items-center gap-2 mb-2 pb-2 border-b border-gray-300">
                        <span className="bg-[#000080] text-white px-2 py-0.5 text-[11px] font-bold font-mono tracking-wider flex items-center gap-1">
                          <span className="w-2 h-2 bg-[#00ff00] inline-block rounded-full animate-ping"></span>
                          SYSTEM.STATUS: ACTIVE_PROD
                        </span>
                        <span className="text-xs text-gray-600 font-mono">
                          Build 1998.4.15 // SMTS-FE-INFRA
                        </span>
                      </div>

                      <h1
                        className="text-3xl font-extrabold text-[#000080] tracking-tight leading-tight mb-1"
                        style={{ fontFamily: "'Pixelify Sans', Tahoma, sans-serif" }}
                      >
                        Naman Kedia
                      </h1>

                      <div className="text-sm font-bold text-[#00557f] mb-2">
                        Senior Member of Technical Staff (SMTS) — FE Infra
                      </div>

                      <div className="bg-[#f0f0f0] border border-gray-400 p-2 font-mono text-xs text-gray-800 space-y-0.5 mb-3">
                        <div>
                          <span className="text-[#000080] font-bold">ALMA_MATER:</span> Georgia Tech MS CS (HCI Specialization, 3.60 GPA)
                        </div>
                        <div>
                          <span className="text-[#000080] font-bold">PREVIOUS_EXP:</span> Ex-Dell Technologies (Senior SWE & Analyst)
                        </div>
                        <div>
                          <span className="text-[#000080] font-bold">BASE_LOCATION:</span> Hyderabad, India [7+ Years Enterprise Track]
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed text-gray-900 border-l-2 border-[#000080] pl-2.5">
                        Full-stack frontend software engineer with 7+ years of track engineering resilient web architectures, developer productivity tooling, and distributed micro-frontend ecosystems. Bridging programmatic systems rigor with deeply empathetic Human-Computer Interaction.
                      </p>
                    </div>

                    {/* Retro Telemetry Status Monitor */}
                    <div className="win-inset-gray p-2 text-xs font-mono">
                      <div className="text-[11px] text-[#000080] font-bold mb-1 flex items-center justify-between border-b border-gray-400 pb-0.5">
                        <span>&gt; DIAGNOSTICS_DAEMON.SYS</span>
                        <span className="text-green-800 font-bold">ONLINE [100% OK]</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-[11px]">
                        <div>• current_initiative: <span className="font-bold text-black">"Self-Hosted Sentry"</span></div>
                        <div>• perf_tier: <span className="font-bold text-black">"Vite 6 ESM + MFE DR"</span></div>
                        <div>• open_to_collab: <span className="text-green-700 font-bold">True</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Retro Framed Profile Photo & System Stats */}
                  <div className="w-full lg:w-72 shrink-0 flex flex-col gap-3">
                    <div className="win-outset p-2 bg-[#d4d0c8]">
                      <div className="text-[11px] font-bold text-black mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-[#000080]">person</span>
                        <span>PHOTO_VIEWER.BMP</span>
                      </div>
                      {/* Beveled Inset Photo Frame */}
                      <div className="win-inset bg-black p-1 flex justify-center items-center">
                        <div className="relative w-full h-64 overflow-hidden bg-black flex items-center justify-center">
                          <img
                            alt="Naman Kedia — SMTS FE Infra"
                            className="w-full h-full object-cover object-top filter contrast-105"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDI7LOwbWJ3yiOsgCuLfeizH6CwYCQvpNYlb_RYYUmlgOba88uWkcJqkIjDdltNLKpcSW8huTa5yl66awUu6_j6_x8bDR1qPmCt_V6RlCNTFMqgj_sI1Oc4PxbvwLGeemWUH8kW4rOiKJDggCwNKRJ2QBi65S7oYskKox03KvAYtxQcqOELNHEv3Sd3MAKjLvgyIvZdL1p_DQPOUli9VIUTGbpYp310Li_sjj2cqyjwGRqYHqWOqsUhRIgF_Iz4H_LYBw"
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-black/75 text-white text-[10px] font-mono p-1 flex justify-between items-center">
                            <span>NAMAN_KEDIA.JPG</span>
                            <span className="text-green-400">3468x4624 RAW</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-center text-xs font-bold text-black">
                        Naman Kedia — SMTS @ ThoughtSpot
                      </div>
                    </div>

                    {/* 4-Stat Benchmark Matrix */}
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="win-inset bg-white p-2">
                        <div className="text-lg font-bold text-[#000080] font-mono">7+</div>
                        <div className="text-[10px] text-gray-600 uppercase font-bold">Years Exp</div>
                      </div>
                      <div className="win-inset bg-white p-2">
                        <div className="text-lg font-bold text-[#008000] font-mono">200+</div>
                        <div className="text-[10px] text-gray-600 uppercase font-bold">Articles</div>
                      </div>
                      <div className="win-inset bg-white p-2">
                        <div className="text-lg font-bold text-[#800080] font-mono">3.60</div>
                        <div className="text-[10px] text-gray-600 uppercase font-bold">GT GPA</div>
                      </div>
                      <div className="win-inset bg-white p-2">
                        <div className="text-lg font-bold text-[#b22222] font-mono">4x+</div>
                        <div className="text-[10px] text-gray-600 uppercase font-bold">Awards</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Status Bar */}
              <div className="bg-[#c0c0c0] px-2 py-1 text-[11px] border-t border-[#808080] flex items-center justify-between text-gray-700 select-none">
                <div className="win-inset-gray px-2 py-0.5 flex-1 mr-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-600"></span>
                  <span>Process PID: 1998 • Ready for commands</span>
                </div>
                <div className="win-inset-gray px-2 py-0.5 text-right font-mono">
                  Mem: 64.0 MB RAM
                </div>
              </div>
            </section>
          )}

          {/* ==================== WINDOW 2: CAREER EXPERIENCE (PROPERTIES DIALOG TABS) ==================== */}
          {!minimizedWindows.experience && (
            <section className="win-outset w-full p-1" id="experience-window">
              {/* Titlebar */}
              <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">history_edu</span>
                  <span>Career Experience & Impact [Properties: C:\Career\Experience.log]</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleWindowMinimize('experience')}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                    title="Minimize"
                  >
                    _
                  </button>
                  <button
                    onClick={() => playClick()}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                    title="Maximize"
                  >
                    □
                  </button>
                  <button
                    onClick={() => toggleWindowMinimize('experience')}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#c0c0c0]">
                {/* Classic Tab Control Header */}
                <div className="flex flex-wrap items-end gap-1 border-b-2 border-[#808080] px-1 pt-1">
                  <button
                    className={`win-tab px-3 text-xs text-black flex items-center gap-1 ${
                      expTab === 'thoughtspot' ? 'active' : 'py-1'
                    }`}
                    onClick={() => {
                      playClick();
                      setExpTab('thoughtspot');
                    }}
                  >
                    <span className="material-symbols-outlined text-xs text-[#000080]">verified</span>
                    <span>ThoughtSpot (Current)</span>
                  </button>
                  <button
                    className={`win-tab px-3 text-xs text-black flex items-center gap-1 ${
                      expTab === 'dell-ft' ? 'active' : 'py-1'
                    }`}
                    onClick={() => {
                      playClick();
                      setExpTab('dell-ft');
                    }}
                  >
                    <span className="material-symbols-outlined text-xs text-[#008000]">domain</span>
                    <span>Dell Technologies (Full-Time)</span>
                  </button>
                  <button
                    className={`win-tab px-3 text-xs text-black flex items-center gap-1 ${
                      expTab === 'dell-intern' ? 'active' : 'py-1'
                    }`}
                    onClick={() => {
                      playClick();
                      setExpTab('dell-intern');
                    }}
                  >
                    <span className="material-symbols-outlined text-xs text-[#b8860b]">school</span>
                    <span>Dell (Internship & PPO)</span>
                  </button>
                  <button
                    className={`win-tab px-3 text-xs text-black flex items-center gap-1 ${
                      expTab === 'freelance' ? 'active' : 'py-1'
                    }`}
                    onClick={() => {
                      playClick();
                      setExpTab('freelance');
                    }}
                  >
                    <span className="material-symbols-outlined text-xs text-[#800080]">code</span>
                    <span>Freelance & Early Tech</span>
                  </button>
                </div>

                {/* Tab Content Box (Inset Container) */}
                <div className="win-outset bg-[#dcdcdc] p-3 -mt-[2px] border-t-0 shadow-sm">
                  
                  {/* TAB 1: THOUGHTSPOT */}
                  {expTab === 'thoughtspot' && (
                    <div className="exp-tab-panel block">
                      <div className="win-inset bg-white p-3 mb-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-b border-gray-300 pb-2 mb-2">
                          <div>
                            <span className="text-base font-bold text-[#000080]">ThoughtSpot</span>
                            <span className="ml-2 bg-green-200 text-green-900 border border-green-700 text-[10px] font-bold px-1.5 py-0.2">
                              ACTIVE TENURE
                            </span>
                            <span className="text-xs text-gray-600 block sm:inline sm:ml-2">
                              Hyderabad, India
                            </span>
                          </div>
                          <div className="font-mono text-xs text-black bg-[#e0e0e0] border border-gray-400 px-2 py-0.5">
                            Jan 2025 — Present
                          </div>
                        </div>

                        <div className="text-xs font-bold text-gray-800 mb-2">
                          Senior Member of Technical Staff (SMTS) — Frontend Infrastructure
                        </div>

                        {/* High Impact Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                          <div className="win-inset-gray p-2">
                            <div className="text-[10px] font-bold text-gray-700 uppercase">Observability Infra</div>
                            <div className="text-xs font-bold text-[#000080]">Self-Hosted Sentry</div>
                            <div className="text-[10px] text-gray-600">Crash telemetry & trace spans</div>
                          </div>
                          <div className="win-inset-gray p-2">
                            <div className="text-[10px] font-bold text-gray-700 uppercase">Build Performance</div>
                            <div className="text-xs font-bold text-[#008000]">Vite 4x → 6x</div>
                            <div className="text-[10px] text-gray-600">Spearheaded full migration</div>
                          </div>
                          <div className="win-inset-gray p-2">
                            <div className="text-[10px] font-bold text-gray-700 uppercase">Throughput Leap</div>
                            <div className="text-xs font-bold text-[#b22222]">Fastify Migration</div>
                            <div className="text-[10px] text-gray-600">Replaced legacy Express</div>
                          </div>
                          <div className="win-inset-gray p-2">
                            <div className="text-[10px] font-bold text-gray-700 uppercase">MFE Resilience</div>
                            <div className="text-xs font-bold text-[#000000]">CDN DR Fallbacks</div>
                            <div className="text-[10px] text-gray-600">AWS S3 / CloudFront recovery</div>
                          </div>
                        </div>

                        <ul className="text-xs space-y-1.5 text-gray-900 list-disc list-inside">
                          <li>
                            <strong className="text-black">Self-Hosted Sentry Pipeline:</strong> Implementing distributed on-premise Sentry cluster for frontend MFEs, capturing crash reports, performance transaction trace spans, and latency alerts.
                          </li>
                          <li>
                            <strong className="text-black">Frontend Diagnostics Overlay:</strong> Deployed in-situ performance HUD telemetry surfacing component render counts, memory allocations, and Web Vitals inside dev/staging.
                          </li>
                          <li>
                            <strong className="text-black">Core FE Infra Mentorship:</strong> Primary escalation contact for micro-frontend bundle optimizations, CI build caching, and cross-team tooling.
                          </li>
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                        <span className="win-btn px-2 py-0.5 cursor-default">Self-Hosted Sentry</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">Vite 6 ESM</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">Fastify API</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">Micro-Frontends</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">AWS CloudFront</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">Web Vitals</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DELL TECHNOLOGIES FULL TIME */}
                  {expTab === 'dell-ft' && (
                    <div className="exp-tab-panel block">
                      <div className="win-inset bg-white p-3 mb-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-b border-gray-300 pb-2 mb-2">
                          <div>
                            <span className="text-base font-bold text-[#000080]">Dell Technologies</span>
                            <span className="ml-2 bg-blue-100 text-blue-900 border border-blue-700 text-[10px] font-bold px-1.5 py-0.2">
                              4 YRS 7 MOS
                            </span>
                            <span className="text-xs text-gray-600 ml-2">Hyderabad, India</span>
                          </div>
                          <div className="font-mono text-xs text-black bg-[#e0e0e0] border border-gray-400 px-2 py-0.5">
                            Jun 2020 — Dec 2024
                          </div>
                        </div>

                        <div className="text-xs font-bold text-gray-800 mb-2">
                          Senior Software Engineer (SE-2, SE-1) / Senior Analyst IT — Self-Service & CI/CD
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                          <div className="win-inset-gray p-2">
                            <div className="text-[10px] font-bold text-gray-700 uppercase">Tooling Impact</div>
                            <div className="text-xs font-bold text-[#000080]">GitHub Portal</div>
                            <div className="text-[10px] text-gray-600">Automated 30s repo spinup</div>
                          </div>
                          <div className="win-inset-gray p-2">
                            <div className="text-[10px] font-bold text-gray-700 uppercase">Agile Culture</div>
                            <div className="text-xs font-bold text-[#008000]">Team Retro App</div>
                            <div className="text-[10px] text-gray-600">Org-wide agile retrospective</div>
                          </div>
                          <div className="win-inset-gray p-2">
                            <div className="text-[10px] font-bold text-gray-700 uppercase">Workflow Boost</div>
                            <div className="text-xs font-bold text-[#b22222]">Chrome Ext & Bot</div>
                            <div className="text-[10px] text-gray-600">Saved 100+ dev hours weekly</div>
                          </div>
                          <div className="win-inset-gray p-2">
                            <div className="text-[10px] font-bold text-gray-700 uppercase">Promotion Track</div>
                            <div className="text-xs font-bold text-black">SE-1 to SE-2</div>
                            <div className="text-[10px] text-gray-600">Rapid technical advancement</div>
                          </div>
                        </div>

                        <ul className="text-xs space-y-1.5 text-gray-900 list-disc list-inside">
                          <li>
                            <strong className="text-black">Strategic Developer Portals:</strong> Architected unified self-service portal automating multi-tenant enterprise repo provisioning, branch rules, and CI/CD webhooks in 30 seconds.
                          </li>
                          <li>
                            <strong className="text-black">Internal Agile Platforms:</strong> Built real-time retrospective dashboard used across dozens of pods to track team sentiment, action items, and sprint delivery velocity.
                          </li>
                          <li>
                            <strong className="text-black">Salesforce & CI/CD Integrations:</strong> Unified enterprise IT pipelines with automated deployment pipelines and linting gates.
                          </li>
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                        <span className="win-btn px-2 py-0.5 cursor-default">React.js</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">Node.js</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">GitHub REST API</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">Chrome Extensions</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">CI/CD Tooling</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">Python</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: DELL INTERNSHIP */}
                  {expTab === 'dell-intern' && (
                    <div className="exp-tab-panel block">
                      <div className="win-inset bg-white p-3 mb-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-b border-gray-300 pb-2 mb-2">
                          <div>
                            <span className="text-base font-bold text-[#000080]">Dell Technologies (Internship)</span>
                            <span className="ml-2 bg-yellow-100 text-yellow-900 border border-yellow-700 text-[10px] font-bold px-1.5 py-0.2">
                              PPO CONVERTED
                            </span>
                            <span className="text-xs text-gray-600 ml-2">Hyderabad, India</span>
                          </div>
                          <div className="font-mono text-xs text-black bg-[#e0e0e0] border border-gray-400 px-2 py-0.5">
                            Nov 2019 — May 2020
                          </div>
                        </div>

                        <div className="text-xs font-bold text-gray-800 mb-2">
                          Software Engineer Summer & Winter Intern
                        </div>

                        <ul className="text-xs space-y-2 text-gray-900 list-disc list-inside">
                          <li>
                            <strong className="text-black">Facial Recognition Attendance System:</strong> Built edge facial recognition web solution with Node.js backend facilitating seamless badge-less campus entry during trial phases.
                          </li>
                          <li>
                            <strong className="text-black">Augmented Reality Product Configurator:</strong> Designed AR-driven demo app giving enterprise clients real-time 3D spatial previews of modular hardware configurations (motherboards, memory, fans).
                          </li>
                          <li>
                            <strong className="text-black">Quality Assurance Automation:</strong> Authored custom SonarQube XML linting rules and Selenium suites to enforce codebase security; recognized with Pre-Placement Offer (PPO).
                          </li>
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                        <span className="win-btn px-2 py-0.5 cursor-default">Computer Vision</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">AR / 3D Visualization</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">SonarQube XML</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">Selenium</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: FREELANCE */}
                  {expTab === 'freelance' && (
                    <div className="exp-tab-panel block">
                      <div className="win-inset bg-white p-3 mb-3">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 border-b border-gray-300 pb-2 mb-2">
                          <div>
                            <span className="text-base font-bold text-[#000080]">Freelance & Early-Stage Startups</span>
                            <span className="ml-2 bg-purple-100 text-purple-900 border border-purple-700 text-[10px] font-bold px-1.5 py-0.2">
                              COLLEGE TENURE
                            </span>
                            <span className="text-xs text-gray-600 ml-2">Remote / India</span>
                          </div>
                          <div className="font-mono text-xs text-black bg-[#e0e0e0] border border-gray-400 px-2 py-0.5">
                            2018 — 2020
                          </div>
                        </div>

                        <div className="text-xs font-bold text-gray-800 mb-2">
                          Web Developer & Technical Freelancer (2+ Years)
                        </div>

                        <ul className="text-xs space-y-2 text-gray-900 list-disc list-inside">
                          <li>
                            <strong className="text-black">Startup Scaffolding Kits:</strong> Created TemplateProvider, open source landing page templates, and modular UI components for early-stage web deployments.
                          </li>
                          <li>
                            <strong className="text-black">UI Sanity & Physics Canvases:</strong> Built the UITesting suite for rapid cross-browser sanity verification and SpinWheel Canvas animation engine with zero external dependencies.
                          </li>
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                        <span className="win-btn px-2 py-0.5 cursor-default">TemplateProvider</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">Canvas API</span>
                        <span className="win-btn px-2 py-0.5 cursor-default">Bootstrap / JS</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Dialog Command Buttons */}
              <div className="bg-[#c0c0c0] px-3 py-2 flex justify-end gap-2 border-t border-[#808080]">
                <button
                  className="win-btn px-4 py-1"
                  onClick={() => {
                    playChord();
                    alert('Configuration verified: All experience logs are up to date and verified.');
                  }}
                >
                  OK
                </button>
                <button
                  className="win-btn px-4 py-1"
                  onClick={() => {
                    playClick();
                    toggleWindowMinimize('experience');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="win-btn px-4 py-1"
                  onClick={() => {
                    playClick();
                    alert('Experience settings applied to active runtime profile.');
                  }}
                >
                  Apply
                </button>
              </div>
            </section>
          )}

          {/* ==================== WINDOW 3: FEATURED PROJECTS (FILE EXPLORER) ==================== */}
          {!minimizedWindows.projects && (
            <section className="win-outset w-full p-1" id="projects-window">
              {/* Titlebar */}
              <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">folder_open</span>
                  <span>Exploring - C:\Naman\Projects\*.*</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleWindowMinimize('projects')}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                    title="Minimize"
                  >
                    _
                  </button>
                  <button
                    onClick={() => playClick()}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                    title="Maximize"
                  >
                    □
                  </button>
                  <button
                    onClick={() => toggleWindowMinimize('projects')}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Explorer Toolbar */}
              <div className="bg-[#c0c0c0] px-2 py-1 text-xs border-b border-[#808080] flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      playClick();
                      scrollToWindow('hero');
                    }}
                    className="win-btn px-2 py-0.5 text-xs flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">arrow_back</span>Back
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      scrollToWindow('hero');
                    }}
                    className="win-btn px-2 py-0.5 text-xs flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">arrow_upward</span>Up
                  </button>
                  <button
                    onClick={() => {
                      playClick();
                      playChord();
                    }}
                    className="win-btn px-2 py-0.5 text-xs flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">refresh</span>Refresh
                  </button>
                </div>
                <div className="flex items-center gap-1 flex-1 min-w-[200px]">
                  <span className="text-xs">Address:</span>
                  <div className="win-inset bg-white px-2 py-0.5 text-xs font-mono flex-1 text-gray-800">
                    C:\Naman\Engineering_Portfolio\Featured_Systems
                  </div>
                </div>
              </div>

              {/* Explorer Projects Grid */}
              <div className="p-3 bg-[#c0c0c0]">
                <div className="win-inset bg-white p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    
                    {/* PROJECT 1: Automated GitHub Portal */}
                    <div className="win-outset p-2 bg-[#dcdcdc] flex flex-col justify-between hover:bg-[#e8e8e8] transition-colors">
                      <div className="mb-2">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-gray-400">
                          <div className="flex items-center gap-1 font-bold text-xs text-[#000080]">
                            <span className="material-symbols-outlined text-sm">hub</span>
                            <span>PORTAL.EXE</span>
                          </div>
                          <span className="text-[9px] bg-blue-100 text-blue-900 px-1 border border-blue-600 font-bold">
                            DELL
                          </span>
                        </div>
                        <div className="font-bold text-xs text-black mb-1">
                          Automated GitHub Project Portal
                        </div>
                        <p className="text-[11px] text-gray-700 leading-tight mb-2">
                          Enterprise developer portal providing guardrailed self-service repository scaffolding, CI/CD webhook injection, branch rules, and sonar gates in 30s.
                        </p>
                        <div className="bg-black text-green-400 p-1.5 font-mono text-[10px] border border-gray-600 mb-2">
                          <div>&gt; provision_repo --org dell</div>
                          <div>Branch Protection: 200 OK</div>
                        </div>
                      </div>
                      <div className="pt-1 border-t border-gray-400 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-gray-600">React • GitHub API</span>
                        <button
                          onClick={() => {
                            playClick();
                            setActiveModal('portal');
                          }}
                          className="win-btn px-1.5 py-0.2 text-[10px] font-bold text-[#000080]"
                        >
                          Internal Demo
                        </button>
                      </div>
                    </div>

                    {/* PROJECT 2: AR Hardware Configurator */}
                    <div className="win-outset p-2 bg-[#dcdcdc] flex flex-col justify-between hover:bg-[#e8e8e8] transition-colors">
                      <div className="mb-2">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-gray-400">
                          <div className="flex items-center gap-1 font-bold text-xs text-[#008000]">
                            <span className="material-symbols-outlined text-sm">view_in_ar</span>
                            <span>AR_VIEW.EXE</span>
                          </div>
                          <span className="text-[9px] bg-green-100 text-green-900 px-1 border border-green-600 font-bold">
                            SPATIAL
                          </span>
                        </div>
                        <div className="font-bold text-xs text-black mb-1">
                          Real-time AR Hardware Configurator
                        </div>
                        <p className="text-[11px] text-gray-700 leading-tight mb-2">
                          Spatial computing browser application allowing enterprise clients to visualize customizable laptop internal hardware layers (motherboards, SSDs) in 3D AR.
                        </p>
                        <div className="bg-black text-green-400 p-1.5 font-mono text-[10px] border border-gray-600 mb-2">
                          <div>&gt; WebXR.initGeometry()</div>
                          <div>FPS: 60 • AR Anchored</div>
                        </div>
                      </div>
                      <div className="pt-1 border-t border-gray-400 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-gray-600">WebXR • Three.js</span>
                        <button
                          onClick={() => {
                            playClick();
                            setActiveModal('arview');
                          }}
                          className="win-btn px-1.5 py-0.2 text-[10px] font-bold text-[#008000]"
                        >
                          3D Demo
                        </button>
                      </div>
                    </div>

                    {/* PROJECT 3: TemplateProvider */}
                    <div className="win-outset p-2 bg-[#dcdcdc] flex flex-col justify-between hover:bg-[#e8e8e8] transition-colors">
                      <div className="mb-2">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-gray-400">
                          <div className="flex items-center gap-1 font-bold text-xs text-[#800080]">
                            <span className="material-symbols-outlined text-sm">dashboard</span>
                            <span>TEMPLATES.DLL</span>
                          </div>
                          <span className="text-[9px] bg-purple-100 text-purple-900 px-1 border border-purple-600 font-bold">
                            DEV KIT
                          </span>
                        </div>
                        <div className="font-bold text-xs text-black mb-1">
                          TemplateProvider Scaffolding Kits
                        </div>
                        <p className="text-[11px] text-gray-700 leading-tight mb-2">
                          Modular repository of responsive landing page templates, component patterns, and scaffolding kits for rapid developer prototyping.
                        </p>
                        <div className="bg-black text-green-400 p-1.5 font-mono text-[10px] border border-gray-600 mb-2">
                          <div>&gt; TemplateProvider.init()</div>
                          <div>Reusable UI block modules</div>
                        </div>
                      </div>
                      <div className="pt-1 border-t border-gray-400 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-gray-600">HTML5 • Bootstrap</span>
                        <a
                          className="win-btn px-1.5 py-0.2 text-[10px] text-black font-bold flex items-center gap-0.5 decoration-none"
                          href="https://github.com/ked27"
                          rel="noopener noreferrer"
                          target="_blank"
                          onClick={() => playClick()}
                        >
                          <span>GitHub</span>
                          <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                        </a>
                      </div>
                    </div>

                    {/* PROJECT 4: SpinWheel UI */}
                    <div className="win-outset p-2 bg-[#dcdcdc] flex flex-col justify-between hover:bg-[#e8e8e8] transition-colors">
                      <div className="mb-2">
                        <div className="flex items-center justify-between pb-1 mb-1 border-b border-gray-400">
                          <div className="flex items-center gap-1 font-bold text-xs text-[#b22222]">
                            <span className="material-symbols-outlined text-sm">rotate_right</span>
                            <span>SPINWHEEL.JS</span>
                          </div>
                          <span className="text-[9px] bg-red-100 text-red-900 px-1 border border-red-600 font-bold">
                            NPM PKG
                          </span>
                        </div>
                        <div className="font-bold text-xs text-black mb-1">
                          SpinWheel UI & Canvas Physics
                        </div>
                        <p className="text-[11px] text-gray-700 leading-tight mb-2">
                          Gamified interactive canvas application featuring customizable segments, realistic angular momentum physics, and zero external runtime dependencies.
                        </p>
                        <div className="bg-black text-green-400 p-1.5 font-mono text-[10px] border border-gray-600 mb-2">
                          <div>&gt; npm i @ked27/spinwheel</div>
                          <div>Angular Deceleration Curve</div>
                        </div>
                      </div>
                      <div className="pt-1 border-t border-gray-400 flex items-center justify-between text-[10px]">
                        <button
                          onClick={() => {
                            playClick();
                            setActiveModal('spinwheel');
                          }}
                          className="win-btn px-1.5 py-0.2 text-[10px] text-[#b22222] font-bold"
                        >
                          ▶ Interactive Spin
                        </button>
                        <a
                          className="win-btn px-1.5 py-0.2 text-[10px] text-black font-bold flex items-center gap-0.5 decoration-none"
                          href="https://github.com/ked27"
                          rel="noopener noreferrer"
                          target="_blank"
                          onClick={() => playClick()}
                        >
                          <span>GitHub</span>
                          <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                        </a>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Explorer Status Bar */}
              <div className="bg-[#c0c0c0] px-2 py-1 text-[11px] border-t border-[#808080] flex items-center justify-between text-gray-700 select-none">
                <div className="win-inset-gray px-2 py-0.5 flex-1 mr-2">
                  4 object(s) selected
                </div>
                <div className="win-inset-gray px-2 py-0.5 text-right font-mono">
                  My Computer
                </div>
              </div>
            </section>
          )}

          {/* ==================== WINDOW 4 & 5: DUAL WINDOW DIALOG (EDUCATION + HONORS) ==================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5" id="academics-window">
            
            {/* LEFT: EDUCATION & WRITING */}
            {!minimizedWindows.academics && (
              <section className="win-outset lg:col-span-7 p-1 flex flex-col justify-between">
                <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">school</span>
                    <span>Academic Pedigree & Technical Writing.doc</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleWindowMinimize('academics')}
                      className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                      title="Minimize"
                    >
                      _
                    </button>
                    <button
                      onClick={() => playClick()}
                      className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                      title="Maximize"
                    >
                      □
                    </button>
                    <button
                      onClick={() => toggleWindowMinimize('academics')}
                      className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#c0c0c0] flex-1 flex flex-col gap-3">
                  {/* Education Inset Cards */}
                  <div className="win-inset bg-white p-3">
                    <div className="text-xs font-bold text-[#000080] border-b border-gray-300 pb-1 mb-2 flex items-center justify-between">
                      <span>FORMAL UNIVERSITY ACCREDITATIONS</span>
                      <span className="material-symbols-outlined text-sm text-gray-500">verified</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {/* Georgia Tech */}
                      <div className="win-outset p-2 bg-[#f4f4f4]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-black">Georgia Tech</span>
                          <span className="win-inset px-1 py-0.2 text-[10px] font-bold font-mono text-[#000080]">
                            GPA: 3.60
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-[#00557f]">
                          Master of Science — CS (HCI)
                        </div>
                        <p className="text-[10px] text-gray-700 mt-1 leading-snug">
                          Specializing in Human-Computer Interaction, cognitive UI models, perceptual latency, and developer ergonomics.
                        </p>
                        <div className="mt-2 pt-1 border-t border-gray-300 text-[10px] text-gray-500 flex justify-between font-mono">
                          <span>Atlanta, GA (Online)</span>
                          <span>2024 — 2026</span>
                        </div>
                      </div>

                      {/* IIIT Bhubaneswar */}
                      <div className="win-outset p-2 bg-[#f4f4f4]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-black">IIIT Bhubaneswar</span>
                          <span className="win-inset px-1 py-0.2 text-[10px] font-bold font-mono text-[#008000]">
                            CGPA: 8.18
                          </span>
                        </div>
                        <div className="text-[11px] font-bold text-[#00557f]">
                          B.Tech — Computer Eng
                        </div>
                        <div className="mt-1 bg-yellow-100 border border-yellow-500 px-1 py-0.5 text-[10px] font-bold text-yellow-900 flex items-center gap-1">
                          ★ 2nd Year University Academic Topper
                        </div>
                        <div className="mt-1 pt-1 border-t border-gray-300 text-[10px] text-gray-500 flex justify-between font-mono">
                          <span>Bhubaneswar, India</span>
                          <span>2016 — 2020</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* GeeksforGeeks Writing Card */}
                  <div className="win-inset bg-white p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-green-700 text-white font-mono text-[9px] px-1 py-0.2 font-bold">
                          AUTHOR OUTREACH
                        </span>
                        <span className="text-xs font-bold text-black">GeeksforGeeks</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900">
                        200+ Technical Articles Published
                      </div>
                      <p className="text-[11px] text-gray-700 mt-0.5 leading-snug">
                        Educating 100K+ engineers globally on React architecture, JS lifecycle, and Web Performance.
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <div className="win-outset bg-[#e8e8e8] p-2 text-center w-20">
                        <div className="text-base font-bold text-[#000080] font-mono">200+</div>
                        <div className="text-[9px] uppercase font-bold text-gray-600">Articles</div>
                      </div>
                      <div className="win-outset bg-[#e8e8e8] p-2 text-center w-20">
                        <div className="text-base font-bold text-[#008000] font-mono">10K+</div>
                        <div className="text-[9px] uppercase font-bold text-gray-600">Readers</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#c0c0c0] px-2 py-1 text-[11px] border-t border-[#808080] text-gray-700">
                  Verified Academic Registry
                </div>
              </section>
            )}

            {/* RIGHT: HONORS & AWARDS */}
            {!minimizedWindows.academics && (
              <section className="win-outset lg:col-span-5 p-1 flex flex-col justify-between">
                <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">emoji_events</span>
                    <span>Honors & Hackathons [Record_Viewer]</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleWindowMinimize('academics')}
                      className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                      title="Minimize"
                    >
                      _
                    </button>
                    <button
                      onClick={() => playClick()}
                      className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                      title="Maximize"
                    >
                      □
                    </button>
                    <button
                      onClick={() => toggleWindowMinimize('academics')}
                      className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
                      title="Close"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#c0c0c0] flex-1 flex flex-col gap-2.5">
                  <div className="win-inset bg-white p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                      {/* Dell Green Coding */}
                      <div className="win-outset p-2 bg-[#f8f8f8]">
                        <div className="text-[10px] font-bold text-green-800 flex items-center gap-1">
                          🏆 1ST PLACE WINNER
                        </div>
                        <div className="text-xs font-bold text-black mt-0.5">Dell Green Coding Hackathon</div>
                        <p className="text-[10px] text-gray-600 mt-1 leading-snug">
                          Zero-waste frontend architecture minimizing compute & battery drain.
                        </p>
                      </div>

                      {/* Dell CTF */}
                      <div className="win-outset p-2 bg-[#f8f8f8]">
                        <div className="text-[10px] font-bold text-blue-800 flex items-center gap-1">
                          🛡️ DUAL CHAMPION
                        </div>
                        <div className="text-xs font-bold text-black mt-0.5">Dell CTF 2020 & 2021</div>
                        <p className="text-[10px] text-gray-600 mt-1 leading-snug">
                          Consecutive 1st place victories in company cybersecurity Capture the Flag.
                        </p>
                      </div>

                      {/* Genhax 2k18 */}
                      <div className="win-outset p-2 bg-[#f8f8f8]">
                        <div className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                          🥇 1ST PLACE (₹20K)
                        </div>
                        <div className="text-xs font-bold text-black mt-0.5">Genhax 2k18 Hackathon</div>
                        <p className="text-[10px] text-gray-600 mt-1 leading-snug">
                          Emergency distributed assistance app for civic disaster relief.
                        </p>
                      </div>

                      {/* Jugaadathon Funded */}
                      <div className="win-outset p-2 bg-[#f8f8f8]">
                        <div className="text-[10px] font-bold text-purple-800 flex items-center gap-1">
                          💡 SEED FUNDED
                        </div>
                        <div className="text-xs font-bold text-black mt-0.5">Dell Jugaadathon Funded</div>
                        <p className="text-[10px] text-gray-600 mt-1 leading-snug">
                          Internal corporate venture seed backing for enterprise tooling.
                        </p>
                      </div>
                    </div>

                    {/* Beyond Code Bar */}
                    <div className="win-inset-gray p-2 text-xs flex items-center justify-between">
                      <span className="font-bold text-black">Beyond Code:</span>
                      <span className="text-[11px] text-gray-800">
                        🎬 Movies & Series • 🏀 Basketball • ⚡ Open Source
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#c0c0c0] px-2 py-1 text-[11px] border-t border-[#808080] text-gray-700">
                  4 Total Corporate & Hackathon Awards
                </div>
              </section>
            )}

          </div>

          {/* ==================== WINDOW 6: CONTACT & LET'S CONNECT ==================== */}
          {!minimizedWindows.contact && (
            <section className="win-outset w-full p-1 max-w-4xl mx-auto" id="contact-window">
              {/* Titlebar */}
              <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">mail</span>
                  <span>Send Message / Connect Dialog [Direct Channel]</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleWindowMinimize('contact')}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                    title="Minimize"
                  >
                    _
                  </button>
                  <button
                    onClick={() => playClick()}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0"
                    title="Maximize"
                  >
                    □
                  </button>
                  <button
                    onClick={() => toggleWindowMinimize('contact')}
                    className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-3 bg-[#c0c0c0]">
                <div className="win-inset bg-white p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                    <div className="flex-1">
                      <div className="inline-block bg-yellow-100 border border-yellow-700 text-yellow-900 text-[11px] font-bold px-2 py-0.5 mb-2">
                        ● AVAILABLE FOR TECHNICAL DISCUSSIONS & ADVISORY
                      </div>
                      <h2
                        className="text-2xl font-bold text-[#000080] mb-1"
                        style={{ fontFamily: "'Pixelify Sans', Tahoma, sans-serif" }}
                      >
                        Let's Connect
                      </h2>
                      <p className="text-xs text-gray-700 leading-relaxed mb-3">
                        Whether discussing high-performance frontend infrastructure, micro-frontend transitions, self-hosted observability pipelines, or human-computer interaction, I’m always open to connecting.
                      </p>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-[#000080]">mail</span>
                          <span className="font-bold text-gray-800">Email:</span>
                          <span className="font-mono text-black font-semibold select-all">nkedia1234@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-[#008000]">call</span>
                          <span className="font-bold text-gray-800">Phone / WhatsApp:</span>
                          <span className="font-mono text-black font-semibold select-all">+91 6204725960</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-base text-[#b22222]">location_on</span>
                          <span className="font-bold text-gray-800">Location:</span>
                          <span className="text-black">Hyderabad, Telangana, India</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Button Group */}
                    <div className="w-full md:w-64 win-outset p-3 bg-[#dcdcdc] flex flex-col gap-2 shrink-0">
                      <div className="text-xs font-bold text-black border-b border-gray-400 pb-1">
                        Quick Action Dispatch
                      </div>

                      <button
                        className="win-btn py-1.5 px-2 font-bold text-center text-xs flex items-center justify-center gap-1"
                        onClick={handleCopyEmail}
                      >
                        <span className="material-symbols-outlined text-xs">content_copy</span>
                        <span>{emailCopied ? '✓ Copied to Clipboard!' : 'Copy Email Address'}</span>
                      </button>

                      <button
                        className="win-btn py-1.5 px-2 font-bold text-center text-xs flex items-center justify-center gap-1 bg-[#000080] text-white"
                        onClick={() => {
                          playClick();
                          setActiveModal('directNote');
                        }}
                      >
                        <span className="material-symbols-outlined text-xs">outgoing_mail</span>
                        <span>Send Direct Note (Quick Form)</span>
                      </button>

                      <a
                        className="win-btn py-1.5 px-2 text-center text-xs text-black font-medium flex items-center justify-center gap-1 decoration-none"
                        href="https://linkedin.com"
                        rel="noopener noreferrer"
                        target="_blank"
                        onClick={() => playClick()}
                      >
                        <span className="material-symbols-outlined text-xs">share</span>
                        <span>LinkedIn Profile</span>
                      </a>

                      <a
                        className="win-btn py-1.5 px-2 text-center text-xs text-black font-medium flex items-center justify-center gap-1 decoration-none"
                        href="https://github.com/ked27"
                        rel="noopener noreferrer"
                        target="_blank"
                        onClick={() => playClick()}
                      >
                        <span className="material-symbols-outlined text-xs">terminal</span>
                        <span>GitHub: @ked27</span>
                      </a>

                      <a
                        className="win-btn py-1.5 px-2 text-center text-xs text-black font-medium flex items-center justify-center gap-1 decoration-none"
                        href="https://instagram.com/kediaaaa"
                        rel="noopener noreferrer"
                        target="_blank"
                        onClick={() => playClick()}
                      >
                        <span className="material-symbols-outlined text-xs">photo_camera</span>
                        <span>Instagram: @kediaaaa</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#c0c0c0] px-3 py-1.5 flex justify-between items-center text-[11px] border-t border-[#808080] text-gray-700">
                <span>Target Host: Naman Kedia (SMTS)</span>
                <span className="font-mono font-bold text-black">Ready</span>
              </div>
            </section>
          )}

        </main>
      </div>

      {/* ==================== WINDOWS 98 RETRO TASKBAR ==================== */}
      <footer className="fixed bottom-0 left-0 right-0 h-10 win-outset bg-[#c0c0c0] z-50 flex items-center justify-between px-1 border-t-2 border-white select-none">
        
        {/* Start Button & Open Tasks */}
        <div className="flex items-center gap-1 h-full py-0.5">
          {/* Start Button */}
          <button
            className={`win-btn h-full px-2.5 flex items-center gap-1 font-bold text-xs ${
              startMenuOpen ? 'win-btn-pressed' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              setStartMenuOpen(!startMenuOpen);
            }}
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5 p-0.5 bg-black">
              <div className="bg-red-500"></div>
              <div className="bg-green-500"></div>
              <div className="bg-blue-500"></div>
              <div className="bg-yellow-500"></div>
            </div>
            <span className="text-sm tracking-wide">Start</span>
          </button>

          <div className="h-6 w-[2px] bg-gray-400 border-r border-white mx-0.5" />

          {/* Active Window Task Buttons */}
          <button
            className={`win-btn h-full px-2.5 flex items-center gap-1.5 text-xs text-black decoration-none ${
              !minimizedWindows.hero ? 'taskbar-btn-active' : ''
            }`}
            onClick={() => {
              if (minimizedWindows.hero) {
                toggleWindowMinimize('hero');
              }
              scrollToWindow('hero');
            }}
          >
            <span className="material-symbols-outlined text-sm text-[#000080]">laptop_mac</span>
            <span className="hidden sm:inline">Naman_Portfolio.exe</span>
          </button>

          <button
            className={`win-btn h-full px-2.5 flex items-center gap-1.5 text-xs text-black decoration-none ${
              !minimizedWindows.experience ? 'taskbar-btn-active' : ''
            }`}
            onClick={() => {
              if (minimizedWindows.experience) {
                toggleWindowMinimize('experience');
              }
              scrollToWindow('experience');
            }}
          >
            <span className="material-symbols-outlined text-sm text-green-800">history_edu</span>
            <span className="hidden sm:inline">Experience.log</span>
          </button>

          <button
            className={`win-btn h-full px-2.5 flex items-center gap-1.5 text-xs text-black decoration-none ${
              !minimizedWindows.projects ? 'taskbar-btn-active' : ''
            }`}
            onClick={() => {
              if (minimizedWindows.projects) {
                toggleWindowMinimize('projects');
              }
              scrollToWindow('projects');
            }}
          >
            <span className="material-symbols-outlined text-sm text-yellow-800">folder</span>
            <span className="hidden sm:inline">Projects.dir</span>
          </button>
        </div>

        {/* System Tray */}
        <div className="win-inset bg-[#c0c0c0] h-full py-0.5 px-2.5 flex items-center gap-2 text-xs font-mono">
          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            className="hover:opacity-75 focus:outline-none flex items-center"
            title={soundEnabled ? 'Audio: Enabled (Click to Mute)' : 'Audio: Muted (Click to Unmute)'}
          >
            <span className="material-symbols-outlined text-sm text-gray-700">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => {
              playClick();
              setCrtEnabled(!crtEnabled);
            }}
            className="hover:opacity-75 focus:outline-none flex items-center"
            title={crtEnabled ? 'CRT Scanlines: ON (Click to toggle)' : 'CRT Scanlines: OFF (Click to toggle)'}
          >
            <span className={`material-symbols-outlined text-sm ${crtEnabled ? 'text-green-800' : 'text-gray-500'}`}>
              tv
            </span>
          </button>

          {/* Network icon */}
          <span className="material-symbols-outlined text-sm text-[#000080]" title="Network Connected: 100 Mbps Ethernet">
            lan
          </span>

          {/* Digital Clock */}
          <span className="font-bold text-black select-none">
            {clockTime || '11:23 PM'}
          </span>
        </div>
      </footer>

      {/* ==================== START MENU ==================== */}
      {startMenuOpen && (
        <StartMenu
          onClose={() => setStartMenuOpen(false)}
          onOpenApp={(appId) => {
            if (['spinwheel', 'portal', 'arview', 'minesweeper', 'terminal', 'shutdown'].includes(appId)) {
              setActiveModal(appId as ModalApp);
            } else if (['hero', 'experience', 'projects', 'academics', 'contact'].includes(appId)) {
              scrollToWindow(appId as WindowId);
            }
          }}
          soundEnabled={soundEnabled}
          onToggleSound={handleSoundToggle}
          crtEnabled={crtEnabled}
          onToggleCrt={() => setCrtEnabled(!crtEnabled)}
          currentTheme={theme}
          onSelectTheme={(t) => setTheme(t as 'teal' | 'navy' | 'matrix' | 'slate')}
        />
      )}

      {/* ==================== INTERACTIVE POPUP APPS ==================== */}
      {activeModal === 'spinwheel' && <SpinWheelDemo onClose={() => setActiveModal(null)} />}
      {activeModal === 'portal' && <PortalDemo onClose={() => setActiveModal(null)} />}
      {activeModal === 'arview' && <ArViewDemo onClose={() => setActiveModal(null)} />}
      {activeModal === 'minesweeper' && <Minesweeper onClose={() => setActiveModal(null)} />}
      {activeModal === 'terminal' && <TerminalPrompt onClose={() => setActiveModal(null)} />}
      {activeModal === 'sourceViewer' && <SourceViewerModal onClose={() => setActiveModal(null)} />}

      {/* Direct Note Quick Dispatch Modal */}
      {activeModal === 'directNote' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="win-outset w-full max-w-md p-1 shadow-2xl">
            <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">outgoing_mail</span>
                <span>Compose Message — Outlook Express 98 [Direct Dispatch]</span>
              </div>
              <button
                onClick={() => {
                  playClick();
                  setActiveModal(null);
                }}
                className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#c0c0c0]">
              {noteSent ? (
                <div className="win-inset bg-white p-6 text-center">
                  <div className="text-2xl mb-2">📬</div>
                  <div className="text-sm font-bold text-green-800 mb-1">Message Queued in Outbox!</div>
                  <div className="text-xs text-gray-700">
                    Your dispatch has been registered. You can also email directly to{' '}
                    <span className="font-mono font-bold text-[#000080]">nkedia1234@gmail.com</span>.
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendNote}>
                  <div className="win-inset bg-white p-3 space-y-2 mb-3">
                    <div className="flex items-center text-xs">
                      <label className="w-16 font-bold text-gray-700">To:</label>
                      <input
                        type="text"
                        readOnly
                        value="Naman Kedia <nkedia1234@gmail.com>"
                        className="flex-1 font-mono text-xs bg-gray-100 border border-gray-300 px-1 py-0.5 text-gray-800"
                      />
                    </div>
                    <div className="flex items-center text-xs">
                      <label className="w-16 font-bold text-gray-700">From / Org:</label>
                      <input
                        type="text"
                        placeholder="Your name or company email"
                        value={noteSender}
                        onChange={(e) => setNoteSender(e.target.value)}
                        className="flex-1 win-inset px-2 py-0.5 text-xs outline-none"
                      />
                    </div>
                    <div className="flex items-center text-xs">
                      <label className="w-16 font-bold text-gray-700">Subject:</label>
                      <input
                        type="text"
                        defaultValue="Frontend Infrastructure / Collaboration Inquiry"
                        className="flex-1 win-inset px-2 py-0.5 text-xs outline-none"
                      />
                    </div>
                    <div className="pt-1">
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Message Body:</label>
                      <textarea
                        rows={4}
                        placeholder="Write your note, feedback, or advisory request here..."
                        value={noteBody}
                        onChange={(e) => setNoteBody(e.target.value)}
                        required
                        className="w-full win-inset p-2 text-xs outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="win-btn px-4 py-1.5 font-bold text-xs bg-[#000080] text-white flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">send</span>
                      Send Note
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setActiveModal(null);
                      }}
                      className="win-btn px-4 py-1.5 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shutdown Modal */}
      {activeModal === 'shutdown' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="win-outset w-full max-w-xs p-1 shadow-2xl">
            <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">power_settings_new</span>
                <span>Shut Down Windows</span>
              </div>
              <button
                onClick={() => {
                  playClick();
                  setActiveModal(null);
                }}
                className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#c0c0c0]">
              <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-3xl text-[#000080]">computer</span>
                <span className="text-xs font-bold text-black">What do you want the computer to do?</span>
              </div>

              <div className="win-inset bg-white p-2 text-xs space-y-1 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="shutdown-action" defaultChecked />
                  <span>Shut down</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="shutdown-action" />
                  <span>Restart</span>
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    playChord();
                    setActiveModal(null);
                    setIsShutDown(true);
                  }}
                  className="win-btn px-4 py-1 font-bold text-xs"
                >
                  OK
                </button>
                <button
                  onClick={() => {
                    playClick();
                    setActiveModal(null);
                  }}
                  className="win-btn px-4 py-1 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
