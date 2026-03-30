import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ColorPicker } from './components/ColorPicker';
import { PaletteDisplay } from './components/PaletteDisplay';
import { PreviewDashboard } from './components/PreviewDashboard';
import { LandingPagePreview } from './components/LandingPagePreview';
import { MobileAppPreview } from './components/MobileAppPreview';
import { ProductCardPreview } from './components/ProductCardPreview';
import { ExportModal } from './components/ExportModal';
import { HarmonyExplorer } from './components/HarmonyExplorer';
import type { ThemeConfig, FullTheme } from './utils/palette';
import {
  getFullTheme,
  extractPinterestTheme,
  generateThemeFromSeed,
  getRandomTheme,
  generateDarkTheme,
} from './utils/palette';
import { Wand, Download, Search, Camera, Loader2, Moon, Sun, Layers } from 'lucide-react';
import chroma from 'chroma-js';
import { SavedPalettes } from './components/SavedPalettes';
import './App.css';

type PreviewMode = 'landing' | 'dashboard' | 'mobile' | 'products';

// ─── URL Theme Codec ─────────────────────────────────────
const decodeThemeFromURL = (): Partial<ThemeConfig> | null => {
  const params = new URLSearchParams(window.location.search);
  const p = params.get('p');
  const s = params.get('s');
  const a = params.get('a');
  const bg = params.get('bg');
  const sf = params.get('sf');
  if (!p || !s || !a) return null;
  try {
    return {
      primary: `#${p}`,
      secondary: `#${s}`,
      accent: `#${a}`,
      background: bg ? `#${bg}` : '#faf9f6',
      surface: sf ? `#${sf}` : '#ffffff',
      moodName: 'Shared Theme',
    };
  } catch {
    return null;
  }
};

// ─── Draggable Sticker ───────────────────────────────────
const DraggableSticker: React.FC<{
  src: string;
  alt: string;
  defaultStyle: React.CSSProperties;
  storageKey: string;
  rotate?: number;
}> = ({ src, alt, defaultStyle, rotate = 0 }) => {
  return (
    <div
      style={{
        ...defaultStyle,
        position: 'absolute',
        zIndex: 10,
        userSelect: 'none',
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <motion.div
        className="duxel-sticker-effect"
        whileHover={{ scale: 1.05 }}
        style={{ width: '100%', height: '100%' }}
      >
        <img src={src} style={{ width: '100%', objectFit: 'contain', pointerEvents: 'none' }} alt={alt} />
      </motion.div>
    </div>
  );
};

// ─── App ─────────────────────────────────────────────────
function App() {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    const fromURL = decodeThemeFromURL();
    if (fromURL) {
      // Clear URL params after loading
      window.history.replaceState({}, '', window.location.pathname);
      return fromURL as ThemeConfig;
    }
    const saved = localStorage.getItem('theme-config');
    return saved ? JSON.parse(saved) : generateThemeFromSeed('#7c9473');
  });

  const [theme, setTheme] = useState<FullTheme>(() => getFullTheme(config));
  const [previewMode, setPreviewMode] = useState<PreviewMode>('landing');
  const [showExport, setShowExport] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useGradient, setUseGradient] = useState(true);
  const [savedThemes, setSavedThemes] = useState<{ id: string; name: string; config: ThemeConfig; timestamp: number }[]>(() => {
    const saved = localStorage.getItem('studio-saved-themes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    setTheme(getFullTheme(config));
    localStorage.setItem('theme-config', JSON.stringify(config));

    document.body.style.setProperty('--theme-primary', config.primary);
    document.body.style.setProperty('--theme-secondary', config.secondary);
    document.body.style.setProperty('--theme-accent', config.accent);
    document.body.style.setProperty('--theme-background', config.background);
    document.body.style.setProperty('--theme-surface', config.surface);
    document.body.style.setProperty('--theme-primary-transparent', `${config.primary}20`);
    document.body.style.setProperty('--theme-secondary-transparent', `${config.secondary}20`);
    document.body.style.setProperty('--theme-accent-transparent', `${config.accent}20`);

    const primaryText = chroma.contrast(config.primary, '#ffffff') > 3 ? '#ffffff' : '#000000';
    document.body.style.setProperty('--theme-primary-text', primaryText);

    localStorage.setItem('studio-saved-themes', JSON.stringify(savedThemes));
  }, [config, savedThemes]);

  // Migrate deprecated names from user's cache
  useEffect(() => {
    if (config.moodName && config.moodName.toLowerCase() === 'oxford mahogany') {
      setConfig(prev => ({ ...prev, moodName: 'AESTHETIC' }));
    }
  }, [config.moodName]);

  useEffect(() => {
    setSavedThemes(prev => {
      let changed = false;
      const newThemes = prev.map(t => {
        if (t.name.toLowerCase() === 'oxford mahogany') {
          changed = true;
          return { ...t, name: 'AESTHETIC' };
        }
        return t;
      });
      return changed ? newThemes : prev;
    });
  }, []);

  const handleColorChange = (key: string, color: string) => {
    setConfig(prev => ({ ...prev, [key]: color }));
    // If user manually changes a color, always reset dark mode display
    setIsDarkMode(false);
  };

  const handleSearch = (value: string) => {
    try {
      const sanitized = value.trim();
      if (!sanitized) return false;
      if (chroma.valid(sanitized)) {
        setConfig(generateThemeFromSeed(sanitized));
        setIsDarkMode(false);
        return true;
      }
    } catch { return false; }
    return false;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    window.alert('Duxel Engine: Local file selected. Starting extraction...');
    setIsExtracting(true);
    try {
      const extractedConfig = await extractPinterestTheme(file);
      setConfig(extractedConfig);
      setIsDarkMode(false);
    } catch (err) {
      console.error('Extraction error:', err);
      window.alert('Extraction Error: ' + err);
    } finally {
      setIsExtracting(false);
      e.target.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
  };

  const randomizeTheme = () => {
    setConfig(getRandomTheme());
    setIsDarkMode(false);
  };

  const [lightConfig, setLightConfig] = useState<ThemeConfig | null>(null);

  const toggleDarkMode = () => {
    if (!isDarkMode) {
      setLightConfig(config);
      setConfig(generateDarkTheme(config));
      setIsDarkMode(true);
    } else {
      if (lightConfig) setConfig(lightConfig);
      setIsDarkMode(false);
    }
  };

  const saveCurrentTheme = () => {
    const name = prompt('Name your Studio Theme:', 'New Atmosphere') || 'Untitled';
    const newTheme = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      config,
      timestamp: Date.now(),
    };
    setSavedThemes(prev => [newTheme, ...prev]);
  };

  const removeSavedTheme = (id: string) => {
    setSavedThemes(prev => prev.filter(t => t.id !== id));
  };

  const PREVIEW_TABS: { id: PreviewMode; label: string }[] = [
    { id: 'landing', label: 'Storefront Story' },
    { id: 'dashboard', label: 'Community Journal' },
    { id: 'mobile', label: 'Mobile App' },
    { id: 'products', label: 'Product Grid' },
  ];

  return (
    <div className="app-container" style={{ background: 'var(--bg-primary)', position: 'relative', minHeight: '100vh' }}>
      {/* Organic Background Blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="blob-1"
          style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'var(--theme-primary-transparent)', filter: 'blur(80px)' }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 60, 0], rotate: [0, -30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="blob-2"
          style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '40vw', height: '40vw', background: 'var(--theme-accent-transparent)', filter: 'blur(80px)' }}
        />
      </div>

      {/* ── Header ─────────────────────────────────────── */}
      <header className="studio-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '1.5rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDarkMode ? 'rgba(15, 15, 18, 0.5)' : 'rgba(250, 249, 246, 0.5)', backdropFilter: 'blur(16px)', transition: 'background 0.3s ease', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <div style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-10px' }}>
            <img src="/duck1.png" alt="Duxel Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', marginTop: '-30px' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--theme-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Duxel <span style={{ opacity: 0.5 }}>Studio</span>
            </h1>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginTop: '0.2rem' }}>
              <span className="label-sticker" style={{ background: 'var(--theme-accent)', color: 'white' }}>{config.moodName || 'PRO DNA'}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
VISUAL IDENTITY SYSTEM
              </span>
            </div>
          </div>
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Gradient Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUseGradient(v => !v)}
            title={useGradient ? 'Switch to Solid Colors' : 'Switch to Gradients'}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '50px',
              border: `1px solid ${useGradient ? config.primary : 'var(--border-light)'}`,
              background: useGradient ? `${config.primary}20` : 'white',
              color: useGradient ? config.primary : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            <Layers size={16} />
            {useGradient ? 'Gradient' : 'Solid'}
          </motion.button>

          {/* Night Mode Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Generate Night Mode'}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '50px',
              border: `1px solid ${isDarkMode ? config.primary : 'var(--border-light)'}`,
              background: isDarkMode ? `${config.primary}20` : 'white',
              color: isDarkMode ? config.primary : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? 'Light Mode' : 'Night Mode'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveCurrentTheme}
            className="scrapbook-card"
            style={{ padding: '0.8rem 1.5rem', flexDirection: 'row', gap: '0.75rem', alignItems: 'center', borderRadius: '50px', border: '1px solid var(--theme-primary)', background: 'transparent', color: 'var(--theme-primary)', cursor: 'pointer' }}
          >
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Save Studio</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowExport(true)}
            className="scrapbook-card"
            style={{ padding: '0.8rem 2rem', flexDirection: 'row', gap: '0.75rem', alignItems: 'center', borderRadius: '50px', border: 'none', background: 'var(--theme-primary)', color: 'var(--theme-primary-text)', cursor: 'pointer', boxShadow: 'var(--shadow-accent)' }}
          >
            <Download size={18} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Export Code</span>
          </motion.button>
        </div>
      </header>

      {/* Spacer to prevent content from jumping under the fixed header */}
      <div style={{ height: '140px' }} />

      <SavedPalettes themes={savedThemes} onSelect={(conf) => { setConfig(conf); setIsDarkMode(false); }} onRemove={removeSavedTheme} />

      {/* ── Main ─────────────────────────────────────── */}
      <main className="main-content" style={{ position: 'relative', zIndex: 5, padding: '0 4rem 10rem' }}>
        <section style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', position: 'relative' }}>

          {/* How it Works */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '3rem',
              background: 'white',
              padding: '3rem',
              borderRadius: '24px',
              border: '1px solid var(--border-light)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {[
              { step: '01', title: 'Curate Atmosphere', desc: 'Pick colors or search unique Hex/RGB values to define your core studio brand.' },
              { step: '02', title: 'Preview Context', desc: 'Toggle between 4 mockup modes to see your theme in real UI contexts.' },
              { step: '03', title: 'Capture Code', desc: 'Copy specific shades or export as CSS, Tailwind, Figma Tokens, ASE, or Share Link.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: config.primary, fontFamily: 'Amatic SC', lineHeight: 1, opacity: 0.3, width: '45px', flexShrink: 0 }}>{item.step}</div>
                <div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.95rem', opacity: 0.7, lineHeight: 1.5 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Color Tools Card ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="scrapbook-card"
            style={{ position: 'relative', overflow: 'visible', zIndex: 2 }}
          >
            {/* Fish Sticker */}
            <DraggableSticker
              src="/fish.png"
              alt="Fish"
              storageKey="sticker-fish"
              defaultStyle={{ top: '-80px', left: '-60px', width: '140px' }}
              rotate={0}
            />

            <div style={{ display: 'flex', marginBottom: '1.5rem' }}>
              <div className="label-sticker">DUXEL START</div>
            </div>

            {/* Hero Duck */}
            <DraggableSticker
              src="/duck5.png"
              alt="Hero Duck"
              storageKey="sticker-duck5"
              defaultStyle={{ top: '-80px', right: '-40px', width: '200px' }}
              rotate={0}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', position: 'relative', zIndex: 5 }}>
              <div>
                <h2 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Capture Visual DNA</h2>
                <p style={{ opacity: 0.5, maxWidth: '600px', fontSize: '1.2rem', fontFamily: 'Nunito', fontWeight: 600 }}>
                  Upload an image to extract high-end aesthetic palettes based on professional design ratios.
                </p>
              </div>

              {/* Search & AI Tools */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.75rem 1.5rem', background: 'var(--bg-primary)',
                    borderRadius: '12px', border: '1px solid var(--border-light)',
                    width: '320px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                  }}>
                    <Search size={18} opacity={0.3} />
                    <input
                      type="text"
                      placeholder="Try 'Ocean' or Color..."
                      onChange={(e) => handleSearch(e.target.value)}
                      onKeyDown={handleKeyDown}
                      style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontWeight: 700, fontSize: '0.9rem', color: '#000000' }}
                    />
                  </div>

                  {/* DNA Capture */}
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={isExtracting}
                      style={{
                        padding: '0.75rem 1.25rem', borderRadius: '12px',
                        border: '1px solid var(--border-light)', background: 'white',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        color: 'var(--theme-primary)', fontSize: '0.9rem', fontWeight: 800, pointerEvents: 'none',
                      }}
                    >
                      {isExtracting ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                      {isExtracting ? 'Analyzing...' : 'Upload '}
                    </motion.button>
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      accept="image/*"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                      title="Click to capture Visual DNA from any picture"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={randomizeTheme}
                    style={{
                      padding: '0.75rem 1.25rem', borderRadius: '12px',
                      border: '1px solid var(--border-light)', background: 'white',
                      display: 'flex', alignItems: 'center', gap: '0.5rem',
                      cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      color: config.primary, fontSize: '0.9rem', fontWeight: 800,
                    }}
                  >
                    <Wand size={18} />
                    Surprise
                  </motion.button>
                </div>

                {/* Technique Label */}
                <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="label-sticker" style={{ background: 'var(--theme-primary)', color: 'white' }}>TECHNIQUE</div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>PINTEREST-GRADE EXTRACTION</span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.4 }}>
                    Automatically balances hierarchy using the anchor-point algorithm for primary, secondary, and accent layers.
                  </span>
                </div>
              </div>
            </div>

            {/* Steps Sticker */}
            <DraggableSticker
              src="/steps.png"
              alt="Steps Sticker"
              storageKey="sticker-steps"
              defaultStyle={{ top: '150px', left: '790px', width: '320px' }}
              rotate={-20}
            />

            <ColorPicker config={config} onChange={handleColorChange} />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-1rem', marginBottom: '1rem', opacity: 0.3, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em' }}>
              (TAP ANY COLOR TO CUSTOMIZE)
            </div>

            <div className="organic-divider" />
            <PaletteDisplay palette={theme.palettes.primary} title="Primary Color Story" />
          </motion.div>

          {/* ── Harmony Explorer ─── */}
          <HarmonyExplorer config={config} onChange={handleColorChange} />

          {/* ── Preview Modes ─── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', position: 'relative', flexWrap: 'wrap' }}>
              <div style={{ position: 'absolute', top: '-40px', fontSize: '1.25rem', fontWeight: 800, opacity: 0.4, letterSpacing: '0.1em', fontFamily: 'Amatic SC' }}>
                CHOOSE YOUR PREVIEW MOCKUP
              </div>
              {PREVIEW_TABS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setPreviewMode(id)}
                  style={{
                    padding: '0.85rem 2.25rem', borderRadius: '50px', border: 'none',
                    background: previewMode === id ? 'white' : 'transparent',
                    boxShadow: previewMode === id ? 'var(--shadow-primary)' : 'none',
                    fontFamily: 'Amatic SC', fontWeight: 800, fontSize: '1.75rem',
                    color: previewMode === id ? config.primary : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={previewMode}
                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                {previewMode === 'dashboard' && <PreviewDashboard theme={theme} useGradient={useGradient} />}
                {previewMode === 'landing' && <LandingPagePreview theme={theme} useGradient={useGradient} />}
                {previewMode === 'mobile' && <MobileAppPreview theme={theme} useGradient={useGradient} />}
                {previewMode === 'products' && <ProductCardPreview theme={theme} useGradient={useGradient} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {showExport && <ExportModal theme={theme} onClose={() => setShowExport(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default App;
