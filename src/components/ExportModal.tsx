import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { FullTheme } from '../utils/palette';
import { Copy, Check, X, Download, Code } from 'lucide-react';

interface ExportModalProps {
  theme: FullTheme;
  onClose: () => void;
}

type ExportFormat = 'css' | 'tailwind' | 'figma' | 'svg' | 'tokens';

const TABS: { id: ExportFormat; label: string }[] = [
  { id: 'css', label: 'CSS' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'figma', label: 'Figma Tokens' },
  { id: 'svg', label: 'SVG Palette' },
  { id: 'tokens', label: 'JSON Tokens' },
];

export const ExportModal: React.FC<ExportModalProps> = ({ theme, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('css');

  const { config } = theme;

  const getCode = (): string => {
    const { primary, secondary, accent, background, surface } = config;

    switch (format) {
      case 'css':
        return `:root {\n  --color-primary: ${primary};\n  --color-secondary: ${secondary};\n  --color-accent: ${accent};\n  --color-bg: ${background};\n  --color-surface: ${surface};\n}`;

      case 'tailwind':
        return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        primary: '${primary}',\n        secondary: '${secondary}',\n        accent: '${accent}',\n        background: '${background}',\n        surface: '${surface}',\n      },\n    },\n  },\n};`;

      case 'figma':
        return JSON.stringify(
          {
            global: {
              'color/primary': { $value: primary, $type: 'color', $description: 'Brand primary color' },
              'color/secondary': { $value: secondary, $type: 'color', $description: 'Secondary brand color' },
              'color/accent': { $value: accent, $type: 'color', $description: 'Accent / highlight color' },
              'color/background': { $value: background, $type: 'color', $description: 'Page background' },
              'color/surface': { $value: surface, $type: 'color', $description: 'Card / surface background' },
            },
          },
          null,
          2
        );

      case 'tokens':
        return JSON.stringify(
          {
            name: config.moodName || 'Custom Theme',
            colors: { primary, secondary, accent, background, surface },
            metadata: { generated: new Date().toISOString(), engine: 'Duxel Neuro-Vision' }
          },
          null,
          2
        );

      case 'svg': {
        const swatches = [
          { label: 'Primary', hex: primary },
          { label: 'Secondary', hex: secondary },
          { label: 'Accent', hex: accent },
          { label: 'Background', hex: background },
          { label: 'Surface', hex: surface },
        ];
        
        let svg = `<svg width="500" height="150" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">\n`;
        swatches.forEach((s, i) => {
          const x = 25 + (i * 95);
          svg += `  <circle cx="${x}" cy="60" r="40" fill="${s.hex}" />\n`;
          svg += `  <text x="${x}" y="125" text-anchor="middle" fill="#888" style="font-family:sans-serif;font-size:10px;font-weight:bold;text-transform:uppercase">${s.label}</text>\n`;
          svg += `  <text x="${x}" y="140" text-anchor="middle" fill="#bbb" style="font-family:monospace;font-size:9px">${s.hex.toUpperCase()}</text>\n`;
        });
        svg += `</svg>`;
        return svg;
      }

      default:
        return '';
    }
  };

  const code = getCode();

  const handleCopy = () => {
    const text = code;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => triggerCopied());
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); triggerCopied(); } catch { }
      document.body.removeChild(ta);
    }
  };

  const triggerCopied = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const isSVG = format === 'svg';
    const blob = new Blob([code], { type: isSVG ? 'image/svg+xml' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `duxel-${(config.moodName || 'theme').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${isSVG ? 'svg' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
    triggerCopied();
  };

  const isDownloadable = format === 'svg' || format === 'tokens';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        padding: '1.5rem',
      }}
    >
      <style>{`
        .export-modal-grid { display: grid; grid-template-columns: 320px 1fr; gap: 3rem; }
        .export-terminal { background: #0d0d0f; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0,0,0,0.5); min-height: 400px; }
        .terminal-header { background: #161619; padding: 0.8rem 1.2rem; display: flex; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .terminal-dots { display: flex; gap: 8px; }
        .terminal-dot { width: 12px; height: 12px; border-radius: 50%; opacity: 0.9; }
        .tab-btn-modern { padding: 1rem 1.25rem; border-radius: 16px; font-weight: 800; font-family: 'Nunito'; text-align: left; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid transparent; background: transparent; color: rgba(255,255,255,0.5); cursor: pointer; }
        .tab-btn-modern.active { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); color: var(--theme-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
        .tab-btn-modern:hover:not(.active) { background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.8); }
        @media (max-width: 800px) {
          .export-modal-grid { grid-template-columns: 1fr; gap: 2rem; }
          .export-terminal { min-height: 300px; }
        }
      `}</style>

      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="export-modal-grid"
        style={{
          background: 'rgba(20, 20, 24, 0.9)', padding: '2.5rem', borderRadius: '32px',
          width: '100%', maxWidth: '1000px', border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 40px 100px -10px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255,255,255,0.05)',
          position: 'relative', overflow: 'hidden', backdropFilter: 'blur(40px) saturate(150%)',
        }}
      >
        {/* Glow effect */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '400px', height: '400px', opacity: 0.1, background: config.primary, filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* Close Button Absolute */}
        <motion.button 
          whileHover={{ rotate: 90, scale: 1.1 }} 
          onClick={onClose} 
          style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', padding: '0.6rem', borderRadius: '50%', zIndex: 50, display: 'flex' }}
        >
          <X size={18} />
        </motion.button>

        {/* Left Column: Context & Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 900, fontFamily: 'Amatic SC', color: 'white', letterSpacing: '0.02em', margin: 0, lineHeight: 1 }}>
            Developer Handoff
          </h2>
          <p style={{ opacity: 0.5, fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Nunito', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.5rem', color: '#fff' }}>
            {config.moodName || 'Custom DNA Theme'}
          </p>

          {/* Overlapping Glass Discs */}
          <div style={{ display: 'flex', marginTop: '1.5rem', paddingLeft: '10px' }}>
            {[config.primary, config.secondary, config.accent, config.background, config.surface].map((hex, i) => (
              <div
                key={i}
                title={hex.toUpperCase()}
                style={{
                  width: '42px', height: '42px', borderRadius: '50%', background: hex,
                  border: '2px solid rgba(255,255,255,0.85)', marginLeft: '-12px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.2)',
                  zIndex: 5 - i, position: 'relative'
                }}
              />
            ))}
          </div>

          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.05)', margin: '2rem 0' }} />

          {/* Vertical Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFormat(tab.id)}
                className={`tab-button tab-btn-modern ${format === tab.id ? 'active' : ''}`}
                title={`Export as ${tab.label}`}
              >
                <span>{tab.label}</span>
                {format === tab.id && <motion.div layoutId="tab-indicator" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--theme-primary)', boxShadow: '0 0 10px var(--theme-primary)' }} />}
              </button>
            ))}
          </div>

          {/* Peeking Export Duck */}
          <motion.div
            initial={{ y: 20, rotate: '15deg' }}
            animate={{ y: 0, rotate: '-5deg' }}
            style={{ position: 'absolute', bottom: '-60px', left: '600px', width: '180px', pointerEvents: 'none', zIndex: 50, opacity: 0.9 }}
          >
            <img src="/duck6.png" style={{ width: '100%', objectFit: 'contain' }} alt="Export Duck" />
          </motion.div>
        </div>

        {/* Right Column: Terminal Window */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 5 }}>
          <div className="export-terminal">
            {/* Terminal Header */}
            <div className="terminal-header">
              <div className="terminal-dots">
                <div className="terminal-dot" style={{ background: '#ff5f56' }} title="Close" />
                <div className="terminal-dot" style={{ background: '#ffbd2e' }} title="Minimize" />
                <div className="terminal-dot" style={{ background: '#27c93f' }} title="Maximize" />
              </div>
              <div style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', fontFamily: 'Nunito', fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>
                {format === 'css' ? 'theme-variables.css' : format === 'tailwind' ? 'tailwind.config.js' : format === 'figma' ? 'tokens.json' : format === 'tokens' ? 'dna.json' : 'palette.svg'}
              </div>
              <div style={{ width: '44px' }}>{/* flex balancer */}</div>
            </div>

            {/* Terminal Body */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.3)' }}>
              
              {isDownloadable ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {format === 'svg' ? <Code size={28} color="rgba(255,255,255,0.7)" /> : <Code size={28} color="rgba(255,255,255,0.7)" />}
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.5rem', color: 'white' }}>
                    {format === 'svg' ? 'SVG Graphic Palette' : 'JSON Design Tokens'}
                  </h3>
                  <p style={{ opacity: 0.5, fontSize: '0.85rem', marginBottom: '2.5rem', lineHeight: 1.6, maxWidth: '280px', color: 'white' }}>
                    {format === 'svg' 
                      ? 'Vectorized palette file for Figma, Sketch, or Illustrator pipelines.' 
                      : 'Raw token data ready to be parsed by your build systems.'}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--theme-primary-transparent)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDownload}
                    style={{ padding: '0.9rem 2rem', borderRadius: '50px', background: 'var(--theme-primary)', color: 'var(--theme-primary-text)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 900 }}
                  >
                    {copied ? <Check size={18} /> : <Download size={18} />}
                    {copied ? 'DOWNLOADED' : `DOWNLOAD .${format.toUpperCase()}`}
                  </motion.button>
                </div>
              ) : (
                <>
                  <pre style={{ margin: 0, flex: 1, padding: '1.5rem', overflow: 'auto', color: '#a9b7c6', fontFamily: '"JetBrains Mono", "Fira Code", monospace', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    <code>
                      {code}
                    </code>
                  </pre>
                  
                  {/* Floating Copy Button */}
                  <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem' }}>
                    <motion.button 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      onClick={handleCopy} 
                      style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', background: copied ? '#27c93f' : 'rgba(255,255,255,0.1)', color: 'white', border: `1px solid ${copied ? '#27c93f' : 'rgba(255,255,255,0.15)'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 900, fontFamily: 'Nunito', letterSpacing: '0.05em', backdropFilter: 'blur(8px)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />} 
                      {copied ? 'CAPTURED' : 'COPY'}
                    </motion.button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

