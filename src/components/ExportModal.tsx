import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { FullTheme } from '../utils/palette';
import { Copy, Check, X, Download } from 'lucide-react';

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
        position: 'fixed', inset: 0, backgroundColor: 'rgba(5, 5, 5, 0.88)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        padding: '1.5rem',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        style={{
          background: 'var(--bg-secondary)', padding: '3.5rem', borderRadius: '48px',
          width: '100%', maxWidth: '760px', border: '1px solid var(--border-light)',
          boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.8)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', opacity: 0.08, background: config.primary, filter: 'blur(80px)', borderRadius: '50%', transform: 'translate(40%, -40%)' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', position: 'relative' }}>
          <div>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, fontFamily: 'Nunito', letterSpacing: '-0.02em' }}>
              STUDIO_EXPORT
            </h2>
            <p style={{ opacity: 0.45, fontSize: '0.8rem', fontWeight: 700, fontFamily: 'Nunito', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.25rem' }}>
              5 formats · {config.moodName || 'Custom Theme'}
            </p>
          </div>
          <motion.button
            whileHover={{ rotate: 90, scale: 1.1 }}
            onClick={onClose}
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', cursor: 'pointer', padding: '0.8rem', borderRadius: '50%', display: 'flex' }}
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Color Preview Strip */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[config.primary, config.secondary, config.accent, config.background, config.surface].map((hex, i) => (
            <div
              key={i}
              title={hex}
              style={{
                flex: 1, height: '32px', background: hex, borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>

        {/* Format Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setFormat(tab.id)}
              className={`tab-button ${format === tab.id ? 'active' : ''}`}
              style={{
                flex: '1 1 auto',
                justifyContent: 'center',
                fontFamily: 'Nunito',
                fontWeight: 800,
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.7rem 0.9rem',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Code Panel or Download UI */}
        {isDownloadable ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ width: '48px', height: '6px', borderRadius: '3px', background: `linear-gradient(90deg, ${config.primary}, ${config.secondary}, ${config.accent})`, margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>
              {format === 'svg' ? 'SVG Graphic Palette' : 'JSON Design Tokens'}
            </h3>
            <p style={{ opacity: 0.55, fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
              {format === 'svg' 
                ? 'Download a vectorized graphic palette. Perfect for dragging into Figma, Sketch, or Adobe tools.' 
                : 'Download a clean JSON file containing all color tokens and metadata for your development pipeline.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {[config.primary, config.secondary, config.accent, config.background, config.surface].map((c, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                  <span style={{ fontSize: '0.5rem', fontFamily: 'monospace', opacity: 0.6 }}>{c.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDownload}
              className="creative-button"
              style={{ padding: '0.9rem 2.5rem', fontSize: '0.9rem', fontFamily: 'Nunito', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
            >
              {copied ? <Check size={18} /> : <Download size={18} />}
              {copied ? 'SUCCESS!' : `Download .${format === 'svg' ? 'svg' : 'json'} File`}
            </motion.button>
          </div>
        ) : (

          <div style={{ position: 'relative' }}>
            <pre
              style={{
                background: 'rgba(0,0,0,0.3)', padding: '2.5rem', borderRadius: '24px',
                overflowX: 'auto', border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.875rem',
                lineHeight: 1.8, maxHeight: '280px', overflowY: 'auto',
              }}
            >
              <code>{code}</code>
            </pre>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="creative-button"
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.55rem 1.1rem',
                fontSize: '0.75rem', zIndex: 10, fontFamily: 'Nunito', fontWeight: 800,
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'CAPTURED' : 'COPY'}
            </motion.button>
          </div>
        )}

        {/* Peeking Export Duck */}
        <motion.div
          className="duxel-sticker-effect"
          initial={{ y: 20, rotate: '10deg' }}
          animate={{ y: 0, rotate: '-5deg' }}
          style={{ position: 'absolute', bottom: '-90px', right: '-70px', width: '180px', pointerEvents: 'none', zIndex: 20 }}
        >
          <img src="/duck6.png" style={{ width: '100%', objectFit: 'contain' }} alt="Export Duck" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
