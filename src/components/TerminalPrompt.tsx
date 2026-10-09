import React, { useState, useRef, useEffect } from 'react';
import { playClick } from '../sound';

interface TerminalProps {
  onClose: () => void;
}

export const TerminalPrompt: React.FC<TerminalProps> = ({ onClose }) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([
    'Microsoft(R) Windows 98',
    '   (C)Copyright Microsoft Corp 1981-1998.',
    '',
    'C:\\NAMAN> WELCOME TO NAMAN KEDIA\'S FE-INFRA COMMAND SHELL',
    'Type "HELP" or "DIR" to view available terminal commands.',
    ''
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;
    playClick();

    const lower = cmd.toLowerCase();
    const newLines = [`C:\\NAMAN> ${cmd}`];

    switch (lower) {
      case 'help':
        newLines.push(
          'Available commands:',
          '  BIO       - Display executive engineer overview',
          '  SKILLS    - Show frontend infrastructure & backend skillset',
          '  EXP       - List professional tenure (ThoughtSpot, Dell)',
          '  PROJECTS  - List flagship enterprise systems',
          '  CONTACT   - Print verified communication endpoints',
          '  DIR       - List virtual system directory contents',
          '  VER       - Print Windows 98 / FE-Infra version',
          '  CLS       - Clear terminal window buffer',
          '  EXIT      - Close this MS-DOS command prompt'
        );
        break;

      case 'bio':
        newLines.push(
          'NAME: Naman Kedia',
          'TITLE: Senior Member of Technical Staff (SMTS) — FE Infra @ ThoughtSpot',
          'ACADEMICS: Georgia Tech MS CS (HCI, 3.60 GPA), IIIT Bhubaneswar B.Tech (8.18)',
          'EXPERIENCE: 7+ Years Enterprise Track in Resilient Micro-Frontends & Dev Productivity'
        );
        break;

      case 'skills':
        newLines.push(
          'LANGUAGES: TypeScript, JavaScript (ESM), Python, HTML5, CSS3, SQL',
          'FRONTEND: React 19, Micro-Frontends (MFEs), Vite 6, Webpack, Module Federation, WebXR',
          'BACKEND: Fastify, Node.js, Express, S3, CloudFront, RESTful APIs',
          'INFRA: Self-Hosted Sentry, CI/CD Webhooks, GitHub APIs, Docker, SonarQube'
        );
        break;

      case 'exp':
        newLines.push(
          '1. ThoughtSpot (Jan 2025 - Present) — SMTS (Frontend Infrastructure)',
          '   - Self-hosted Sentry pipeline, Vite 6 migration, Fastify API proxy',
          '2. Dell Technologies (Jun 2020 - Dec 2024) — Senior Software Engineer',
          '   - Self-service GitHub repo provisioner portal, internal agile retro suite',
          '3. Dell Technologies (Nov 2019 - May 2020) — SWE Intern (PPO converted)',
          '   - AR hardware configurator & facial recognition attendance'
        );
        break;

      case 'projects':
        newLines.push(
          'PORTAL.EXE    - Automated GitHub Project Scaffolding Portal (30s spinup)',
          'AR_VIEW.EXE   - Real-time AR Hardware Configurator in WebXR',
          'TEMPLATES.DLL - Modular UI TemplateProvider scaffolding suites',
          'SPINWHEEL.JS  - Pure Canvas 2D Physics Deceleration Engine'
        );
        break;

      case 'contact':
        newLines.push(
          'Email: nkedia1234@gmail.com',
          'Phone / WhatsApp: +91 6204725960',
          'GitHub: https://github.com/ked27',
          'Location: Hyderabad, Telangana, India'
        );
        break;

      case 'dir':
        newLines.push(
          ' Volume in drive C is FE_INFRA_98',
          ' Volume Serial Number is 1998-FE01',
          ' Directory of C:\\NAMAN',
          '',
          'BIO_V98  EXE       342,880  10-08-98  11:23p BIO_V98.EXE',
          'EXPERIEN LOG        54,120  10-08-98  11:23p Experience.log',
          'PROJECTS DIR             <DIR>        10-08-98  11:23p Projects',
          'HONORS   DOC        28,490  10-08-98  11:23p Honors.doc',
          'CONNECT  MSG        12,300  10-08-98  11:23p Connect.msg',
          'SPINWHEL JS         18,640  10-08-98  11:23p SPINWHEEL.JS',
          '               6 File(s)        456,430 bytes',
          '               1 Dir(s)   4,194,304,000 bytes free'
        );
        break;

      case 'ver':
        newLines.push('Windows 98 [Version 4.10.1998] — FE Infra Build 6.0');
        break;

      case 'cls':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
        onClose();
        return;

      default:
        newLines.push(`Bad command or file name: "${cmd}". Type "HELP" for command list.`);
    }

    setHistory((prev) => [...prev, ...newLines]);
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="win-outset w-full max-w-xl p-1 shadow-2xl">
        <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">terminal</span>
            <span>MS-DOS Prompt — C:\NAMAN\COMMAND.COM</span>
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

        <div className="p-2 bg-black text-green-400 font-mono text-xs h-80 overflow-y-auto select-text">
          {history.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-tight">
              {line}
            </div>
          ))}

          <form onSubmit={handleCommand} className="flex items-center mt-1">
            <span className="text-white mr-1">C:\NAMAN&gt;</span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-green-400 outline-none border-none font-mono text-xs"
            />
          </form>
          <div ref={bottomRef} />
        </div>

        <div className="bg-[#c0c0c0] p-1 text-[11px] text-gray-700 flex justify-between border-t border-[#808080]">
          <span>Prompt: Type HELP, BIO, EXP, PROJECTS, or EXIT</span>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="win-btn px-2 py-0.5 text-[10px]"
          >
            Close Prompt
          </button>
        </div>
      </div>
    </div>
  );
};
