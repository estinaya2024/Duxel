import { useState, useEffect } from 'react';
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
  extractExactTheme,
  generateThemeFromSeed,
  getRandomTheme,
  generateDarkTheme,
  validateColor,
} from './utils/palette';
import { Wand, Download, Search, Camera, Loader2, Moon, Sun, Layers, Undo2, Redo2, Crown, Zap, Palette, Maximize, Check } from 'lucide-react';
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
      className="draggable-sticker-container"
      style={{
        ...defaultStyle,
        position: 'absolute',
        zIndex: 10,
        userSelect: 'none',
        transform: `rotate(${rotate}deg)`,
        pointerEvents: 'none', // Prevent decoration from blocking underlying UI
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

// ─── Role Mapper Component ───────────────────────────────
interface RoleMapperProps {
  color: string;
  onMap: (role: keyof ThemeConfig) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

const RoleMapper: React.FC<RoleMapperProps> = ({ color, onMap, onClose, isDarkMode }) => {
  const roles: { label: string; role: keyof ThemeConfig; title: string; icon: any; colorSuffix: string }[] = [
    { label: 'Primary', role: 'primary', title: 'Set as Hero Primary', icon: Crown, colorSuffix: 'primary' },
    { label: 'Secondary', role: 'secondary', title: 'Set as Secondary', icon: Palette, colorSuffix: 'secondary' },
    { label: 'Accent', role: 'accent', title: 'Set as Accent', icon: Zap, colorSuffix: 'accent' },
    { label: 'Base', role: 'background', title: 'Set as Background', icon: Maximize, colorSuffix: 'background' },
    { label: 'Surface', role: 'surface', title: 'Set as Surface', icon: Layers, colorSuffix: 'surface' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        position: 'relative',
        background: isDarkMode ? 'rgba(30, 30, 35, 0.98)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(32px) saturate(180%)',
        padding: '1.5rem', borderRadius: '32px',
        boxShadow: isDarkMode ? '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)' : '0 30px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.05)',
        minWidth: '400px',
        zIndex: 3001,
      }}
    >
      {/* Current Color Preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem', padding: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: '20px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: color, border: '3px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 900, opacity: 0.5, textTransform: 'uppercase' }}>Mapping DNA Color</div>
          <div style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'monospace' }}>{color.toUpperCase()}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>

        {roles.map(btn => (
          <motion.button
            key={btn.role}
            whileHover={{ y: -4, background: `var(--theme-${btn.colorSuffix}-transparent)` }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onMap(btn.role);
              onClose();
            }}
            style={{
              background: 'rgba(0,0,0,0.02)', border: 'none',
              padding: '12px 8px', borderRadius: '16px',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '6px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            title={btn.title}
          >
            <btn.icon size={18} color={`var(--theme-${btn.colorSuffix})`} strokeWidth={2.5} />
            <span style={{ fontSize: '0.65rem', fontWeight: 900, color: isDarkMode ? '#fff' : '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {btn.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// ─── App ─────────────────────────────────────────────────
function App() {
  // Default palette sampled from exmple-img.jpg
  const DEFAULT_THEME: ThemeConfig = {
    primary: '#7a9e6e', // sage green (dominant meadow tone)
    secondary: '#c89aab', // dusty pink (wildflower foreground)
    accent: '#e8b4c0', // blush pink (flower highlights)
    background: '#f5f0eb', // warm off-white (painted sky/ground)
    surface: '#4a6741', // deep olive (tree masses)
    moodName: 'Pastoral',
  };

  const [config, setConfig] = useState<ThemeConfig>(() => {
    const fromURL = decodeThemeFromURL();
    if (fromURL) {
      window.history.replaceState({}, '', window.location.pathname);
      return fromURL as ThemeConfig;
    }
    const saved = localStorage.getItem('theme-config');
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });

  const [theme, setTheme] = useState<FullTheme>(() => getFullTheme(config));
  const [previewMode, setPreviewMode] = useState<PreviewMode>('landing');
  const [showExport, setShowExport] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStep, setExtractionStep] = useState('');
  const [activeMapperIndex, setActiveMapperIndex] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useGradient, setUseGradient] = useState(true);
  const [savedThemes, setSavedThemes] = useState<{ id: string; name: string; config: ThemeConfig; timestamp: number }[]>(() => {
    const saved = localStorage.getItem('studio-saved-themes');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchPreview, setSearchPreview] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<{ hex: string; population: number }[]>([]);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [lastCopiedHex, setLastCopiedHex] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex.toUpperCase());
    setLastCopiedHex(hex);
    setTimeout(() => setLastCopiedHex(null), 1500);
  };

  const [history, setHistory] = useState<ThemeConfig[]>([config]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushToHistory = (newConfig: ThemeConfig) => {
    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newConfig];
    });
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevConfig = history[historyIndex - 1];
      setConfig(prevConfig);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextConfig = history[historyIndex + 1];
      setConfig(nextConfig);
      setHistoryIndex(historyIndex + 1);
    }
  };

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
    document.body.style.setProperty('--theme-background-transparent', `${config.background}20`);
    document.body.style.setProperty('--theme-surface-transparent', `${config.surface}20`);

    const primaryText = chroma.contrast(config.primary, '#ffffff') > 3 ? '#ffffff' : '#000000';
    document.body.style.setProperty('--theme-primary-text', primaryText);

    localStorage.setItem('studio-saved-themes', JSON.stringify(savedThemes));
  }, [config, savedThemes]);

  useEffect(() => {
    if (config.moodName && config.moodName.toLowerCase() === 'oxford mahogany') {
      setConfig(prev => ({ ...prev, moodName: 'AESTHETIC' }));
    }
  }, [config.moodName]);

  // ─── Auto-load example image on first visit ──────────────
  useEffect(() => {
    const runExampleExtraction = async () => {
      setIsExtracting(true);
      setExtractionStep('INITIALIZING VISION...');
      try {
        const res = await fetch('/exmple-img.jpg');
        const blob = await res.blob();
        const file = new File([blob], 'exmple-img.jpg', { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);
        setActiveImage(url);

        await new Promise(r => setTimeout(r, 600));
        setExtractionStep('MAPPING OKLCH GEOMETRY...');

        const { config: extractedConfig, swatches } = await extractExactTheme(file);

        await new Promise(r => setTimeout(r, 400));
        setExtractionStep('SYNTHESIZING NEURO-ROLES...');
        await new Promise(r => setTimeout(r, 400));
        setExtractionStep('BALANCING CHROMATIC CONTRAST...');

        setExtractedColors(swatches);

        // Always apply the example image palette as the starting theme
        setConfig(extractedConfig);
        setHistory([extractedConfig]);
        setHistoryIndex(0);
        localStorage.removeItem('theme-config'); // clear stale seed so extracted palette persists
      } catch (err) {
        console.error('Example image extraction failed:', err);
      } finally {
        setIsExtracting(false);
        setExtractionStep('');
      }
    };
    runExampleExtraction();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleColorChange = (key: string, color: string) => {
    const newConfig = { ...config, [key]: color };
    setConfig(newConfig);
    pushToHistory(newConfig);
    setIsDarkMode(false);
  };

  const handleConfigUpdate = (newPartialConfig: Partial<ThemeConfig>) => {
    const newConfig = { ...config, ...newPartialConfig };
    setConfig(newConfig);
    pushToHistory(newConfig);
  };

  const handleSearch = (value: string) => {
    const validHex = validateColor(value);
    if (validHex) {
      setSearchPreview(validHex);
      const newConfig = generateThemeFromSeed(validHex, true);
      setConfig(newConfig);
      pushToHistory(newConfig);
      setIsDarkMode(false);
      return true;
    } else {
      setSearchPreview(null);
      return false;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setExtractionStep('INITIALIZING VISION...');

    try {
      const url = URL.createObjectURL(file);
      setActiveImage(url);

      await new Promise(r => setTimeout(r, 600));
      setExtractionStep('MAPPING OKLCH GEOMETRY...');

      const { config: extractedConfig, swatches } = await extractExactTheme(file);

      await new Promise(r => setTimeout(r, 400));
      setExtractionStep('SYNTHESIZING NEURO-ROLES...');

      await new Promise(r => setTimeout(r, 400));
      setExtractionStep('BALANCING CHROMATIC CONTRAST...');

      setExtractedColors(swatches);
      setConfig(extractedConfig);
      pushToHistory(extractedConfig);
      setIsDarkMode(false);
    } catch (err) {
      console.error('Extraction error:', err);
      window.alert('Extraction Error: ' + err);
    } finally {
      setIsExtracting(false);
      setExtractionStep('');
      e.target.value = '';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
  };

  const randomizeTheme = () => {
    const newConfig = getRandomTheme();
    setConfig(newConfig);
    pushToHistory(newConfig);
    setIsDarkMode(false);
  };

  const [lightConfig, setLightConfig] = useState<ThemeConfig | null>(null);

  const toggleDarkMode = () => {
    if (!isDarkMode) {
      setLightConfig(config);
      const darkConfig = generateDarkTheme(config);
      setConfig(darkConfig);
      pushToHistory(darkConfig);
      setIsDarkMode(true);
    } else {
      if (lightConfig) {
        setConfig(lightConfig);
        pushToHistory(lightConfig);
      }
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
      <div className={`atmosphere-container ${isDarkMode ? 'dark' : ''}`}>
        <div className="living-blob living-blob-1" />
        <div className="living-blob living-blob-2" />
        <div className="living-blob living-blob-3" />
      </div>

      <header className="studio-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDarkMode ? 'rgba(15, 15, 18, 0.7)' : 'rgba(250, 249, 246, 0.7)', backdropFilter: 'blur(20px)', transition: 'background 0.3s ease', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <div style={{ width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '-10px' }}>
            <img src="/duck1.png" alt="Duxel Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', marginTop: '-30px' }} />
          </div>
          <div>
            <h1 className="studio-title" style={{ fontWeight: 900, color: 'var(--theme-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUseGradient(v => !v)}
            title={useGradient ? 'Switch to Solid Colors' : 'Switch to Gradients'}
            className="scrapbook-card header-action-btn"
            style={{ padding: '0.75rem 1.25rem', borderRadius: '50px', border: `1px solid ${useGradient ? config.primary : 'var(--border-light)'}`, background: useGradient ? `${config.primary}20` : 'white', color: useGradient ? config.primary : 'var(--text-muted)', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' }}
          >
            <Layers size={16} />
            {useGradient ? 'Gradient' : 'Solid'}
          </motion.button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', borderRadius: '50px', padding: '0.25rem', border: '1px solid var(--border-light)' }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={undo}
              disabled={historyIndex === 0}
              style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: historyIndex === 0 ? '#ccc' : 'var(--text-primary)', cursor: historyIndex === 0 ? 'default' : 'pointer', display: 'flex' }}
              title="Undo"
            >
              <Undo2 size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={redo}
              disabled={historyIndex === history.length - 1}
              style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: historyIndex === history.length - 1 ? '#ccc' : 'var(--text-primary)', cursor: historyIndex === history.length - 1 ? 'default' : 'pointer', display: 'flex' }}
              title="Redo"
            >
              <Redo2 size={20} />
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Generate Night Mode'}
            className="scrapbook-card header-action-btn"
            style={{ padding: '0.75rem 1.25rem', borderRadius: '50px', border: `1px solid ${isDarkMode ? config.primary : 'var(--border-light)'}`, background: isDarkMode ? `${config.primary}20` : 'white', color: isDarkMode ? config.primary : 'var(--text-muted)', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem' }}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            {isDarkMode ? 'Light Mode' : 'Night Mode'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveCurrentTheme}
            className="scrapbook-card header-action-btn"
            style={{ padding: '0.8rem 1.5rem', alignItems: 'center', borderRadius: '50px', border: '1px solid var(--theme-primary)', background: 'transparent', color: 'var(--theme-primary)', cursor: 'pointer' }}
          >
            <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Save Studio</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowExport(true)}
            className="scrapbook-card header-action-btn"
            style={{ padding: '0.8rem 2rem', alignItems: 'center', borderRadius: '50px', border: 'none', background: 'var(--theme-primary)', color: 'var(--theme-primary-text)', cursor: 'pointer', boxShadow: 'var(--shadow-accent)' }}
          >
            <Download size={18} />
            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Export Code</span>
          </motion.button>
        </div>
      </header>

      <div style={{ height: '230px' }} />

      <SavedPalettes themes={savedThemes} onSelect={(conf) => { setConfig(conf); setIsDarkMode(false); }} onRemove={removeSavedTheme} />

      <main className="main-content" style={{ position: 'relative', zIndex: 5 }}>
        <section style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '4rem', position: 'relative' }}>

          <div className="vision-report-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
            {[
              { step: '01', title: 'Curate Atmosphere', desc: 'Pick colors or search unique Hex/RGB values to define your core studio brand.' },
              { step: '02', title: 'Preview Context', desc: 'Toggle between 4 mockup modes to see your theme in real UI contexts.' },
              { step: '03', title: 'Capture Code', desc: 'Copy specific shades or export as SVG, JSON, CSS, and Figma Tokens.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: config.primary, fontFamily: 'Amatic SC', lineHeight: 1, opacity: 0.3, width: '40px', flexShrink: 0 }}>{item.step}</div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.9rem', opacity: 0.7, lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="scrapbook-card" style={{ position: 'relative', overflow: 'visible', zIndex: 2 }}>
            <DraggableSticker src="/fish.png" alt="Fish" storageKey="sticker-fish" defaultStyle={{ top: '-80px', left: '-60px', width: '140px' }} rotate={0} />
            <div style={{ display: 'flex', marginBottom: '1.5rem' }}><div className="label-sticker">DUXEL START</div></div>
            <DraggableSticker src="/duck5.png" alt="Hero Duck" storageKey="sticker-duck5" defaultStyle={{ top: '-80px', right: '-40px', width: '200px' }} rotate={0} />

            <div className="tool-grid">
              <div>
                <h2 className="hero-title" style={{ color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1.2, fontWeight: 900, marginBottom: '1.5rem' }}>Capture <br /> <span style={{ color: 'var(--theme-primary)' }}>Visual DNA</span></h2>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ opacity: 0.6, maxWidth: '440px', fontSize: '1.25rem', fontFamily: 'Nunito', fontWeight: 600, lineHeight: 1.6, marginBottom: '2rem' }}>Upload any image to instantly create a professional, high-contrast color palette.</p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={isExtracting} style={{ padding: '1rem 2rem', borderRadius: '14px', border: 'none', background: 'var(--theme-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: 'var(--shadow-primary)', color: 'var(--theme-primary-text)', fontSize: '1rem', fontWeight: 900 }}>
                          {isExtracting ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
                          {isExtracting ? 'Synthesizing...' : 'Upload Source'}
                        </motion.button>
                        <input type="file" onChange={handleImageUpload} accept="image/*" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} />
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={randomizeTheme} style={{ padding: '1rem 1.5rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'white', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 800 }}><Wand size={20} /> Surprise</motion.button>
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                      <ColorPicker config={config} onChange={handleColorChange} />
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.3, letterSpacing: '0.1em', marginTop: '0.5rem' }}>(TAP ANY COLOR TO CUSTOMIZE)</div>
                    </div>
                  </div>
                  {activeImage && (
                    <motion.div layoutId="source-preview" initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }} style={{ width: '240px', height: '240px', borderRadius: '24px', overflow: 'hidden', border: '8px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', position: 'relative', flexShrink: 0 }}>
                      <img src={activeImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Source" />
                      {isExtracting && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', zIndex: 30 }}>
                          <div className="scan-line" />
                          <Loader2 size={32} className="animate-spin mb-3" />
                          <span style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{extractionStep}</span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', background: 'white', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>{searchPreview ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: '20px', height: '20px', borderRadius: '50%', background: searchPreview, border: '1px solid rgba(0,0,0,0.1)' }} /> : <Search size={22} opacity={0.3} />}</div>
                  <input type="text" placeholder="Search name, HEX, RGB, or CMYK..." onChange={(e) => handleSearch(e.target.value)} onKeyDown={handleKeyDown} style={{ border: 'none', background: 'transparent', width: '100%', outline: 'none', fontWeight: 800, fontSize: '1rem', color: '#000' }} />
                </div>

                <AnimatePresence mode="wait">
                  {extractedColors.length > 0 ? (
                    <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 900, marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}><span>VISUAL DNA SYNTHESIS</span><span style={{ opacity: 0.5 }}>DOMINANCE HIERARCHY</span></div>
                      <div className="dna-bar-container" style={{ marginBottom: '2rem' }}>
                        {extractedColors.slice(0, 5).map((c, idx) => {
                          const total = extractedColors.slice(0, 5).reduce((acc, curr) => acc + curr.population, 0);
                          const width = (c.population / total) * 100;
                          const isActive = activeMapperIndex === idx;
                          const isCurrentlyUsed = [config.primary.toLowerCase(), config.secondary.toLowerCase(), config.accent.toLowerCase(), config.background.toLowerCase(), config.surface.toLowerCase()].includes(c.hex.toLowerCase());
                          return (
                            <motion.div key={`${c.hex}-${idx}`} initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ duration: 1, delay: idx * 0.1, ease: [0.34, 1.56, 0.64, 1] }} className="dna-segment" style={{ background: c.hex, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', cursor: 'pointer', overflow: 'visible', outline: isActive ? `3px solid ${chroma.contrast(c.hex, '#fff') > 3 ? '#fff' : '#000'}` : 'none', outlineOffset: '-3px' }} onClick={() => setActiveMapperIndex(isActive ? null : idx)} title="Click to Map color to a design role">
                              <span className="dna-label">{Math.floor(width)}%</span>
                              {isCurrentlyUsed && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'copy' }} onClick={(e) => { e.stopPropagation(); copyToClipboard(c.hex); }} title={`Click to copy: ${c.hex.toUpperCase()}`}>
                                  <Check size={14} color={chroma.contrast(c.hex, '#fff') > 4.5 ? '#fff' : '#000'} strokeWidth={4} />
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>

                      <div className="vision-report-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}><span style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Neuro Analysis</span><div className="analysis-tag">Stable v3</div></div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                          <div><div style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 800 }}>PRIMARY MOOD</div><div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--theme-primary)' }}>{config.moodName?.split('·')[0]}</div></div>
                          <div><div style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 800 }}>ATMOSPHERE</div><div style={{ fontSize: '1rem', fontWeight: 900 }}>{isDarkMode ? 'Night Mode' : 'Daylight'}</div></div>
                          <div style={{ gridColumn: 'span 2' }}>
                            <div style={{ fontSize: '0.65rem', opacity: 0.5, fontWeight: 800, marginBottom: '0.6rem' }}>SYNTHESIZED ROLES</div>
                            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                              <span className="analysis-tag" style={{ background: `${config.primary}20` }}>Hero Primary</span>
                              <span className="analysis-tag" style={{ background: `${config.accent}20` }}>Identity Accent</span>
                              <span className="analysis-tag" style={{ background: `${config.background}20` }}>Base Neutral</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '2rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                            <div>
                              <div style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Latent DNA Discovery</div>
                              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>Rare Findings</h3>
                            </div>
                            <div className="analysis-tag" style={{ background: 'var(--theme-primary-transparent)', color: 'var(--theme-primary)' }}>{extractedColors.length - 5} Latent Shades</div>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(36px, 1fr))', gap: '12px', position: 'relative', minHeight: '80px' }}>
                            {extractedColors.length > 5 ? (
                              extractedColors.slice(5, 29).map((c, idx) => {
                                const realIdx = idx + 5;
                                const isActive = activeMapperIndex === realIdx;
                                const isCurrentlyUsed = [config.primary.toLowerCase(), config.secondary.toLowerCase(), config.accent.toLowerCase(), config.background.toLowerCase(), config.surface.toLowerCase()].includes(c.hex.toLowerCase());
                                return (
                                  <motion.div key={`latent-${realIdx}`} whileHover={{ scale: 1.2, zIndex: 30, y: -4 }} whileTap={{ scale: 0.9 }} onContextMenu={(e) => { e.preventDefault(); copyToClipboard(c.hex); }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveMapperIndex(isActive ? null : realIdx); }} style={{ width: '36px', height: '36px', borderRadius: '12px', background: c.hex, border: '3px solid white', boxShadow: isActive ? `0 0 0 3px var(--theme-primary), 0 12px 24px rgba(0,0,0,0.2)` : (isCurrentlyUsed ? `0 0 0 2px var(--theme-primary), 0 8px 20px rgba(0,0,0,0.15)` : '0 6px 16px rgba(0,0,0,0.12)'), cursor: 'pointer', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: isActive ? 2001 : 1, position: 'relative' }} title="Left-click to map | Right-click to copy HEX">
                                    {isCurrentlyUsed && (
                                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        <Check size={14} color={chroma.contrast(c.hex, '#fff') > 4.5 ? '#fff' : '#000'} strokeWidth={4} />
                                      </motion.div>
                                    )}
                                  </motion.div>
                                );
                              })
                            ) : (
                              <div className="empty-dna-placeholder" style={{ gridColumn: '1 / -1' }}>
                                <Zap size={24} style={{ marginBottom: '0.8rem', opacity: 0.4 }} />
                                <div style={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Awaiting DNA Capture</div>
                                <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Upload an image to reveal hidden studio shades</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '3rem 2rem', textAlign: 'center', background: 'rgba(0,0,0,0.02)', borderRadius: '24px', border: '2px dashed var(--border-light)' }}>
                      <Camera size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.4 }}>Upload an image above <br /> to reveal its Visual DNA.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <DraggableSticker src="/steps.png" alt="Steps Sticker" storageKey="sticker-steps" defaultStyle={{ bottom: '-700px', right: '-100px', width: '380px' }} rotate={15} />
            <div className="organic-divider" style={{ marginTop: '2rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem' }}>
                <PaletteDisplay palette={theme.palettes.primary} title="Hero" />
                <PaletteDisplay palette={theme.palettes.secondary} title="Draft" />
                <PaletteDisplay palette={theme.palettes.accent} title="Pulse" />
                <PaletteDisplay palette={theme.palettes.background} title="Base" />
                <PaletteDisplay palette={theme.palettes.surface} title="Surface" />
              </div>
            </div>
          </motion.div>

          <HarmonyExplorer config={config} onUpdate={handleConfigUpdate} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', position: 'relative', flexWrap: 'wrap' }}>
              <div style={{ position: 'absolute', top: '-40px', fontSize: '1.25rem', fontWeight: 800, opacity: 0.4, letterSpacing: '0.1em', fontFamily: 'Amatic SC' }}>CHOOSE YOUR PREVIEW MOCKUP</div>
              {PREVIEW_TABS.map(({ id, label }) => (
                <button key={id} onClick={() => setPreviewMode(id)} style={{ padding: '0.85rem 2.25rem', borderRadius: '50px', border: 'none', background: previewMode === id ? 'white' : 'transparent', boxShadow: previewMode === id ? 'var(--shadow-primary)' : 'none', fontFamily: 'Amatic SC', fontWeight: 800, fontSize: '1.75rem', color: previewMode === id ? config.primary : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.2s ease' }}>{label}</button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={previewMode} initial={{ opacity: 0, scale: 0.98, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: -20 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
                {previewMode === 'dashboard' && <PreviewDashboard theme={theme} useGradient={useGradient} />}
                {previewMode === 'landing' && <LandingPagePreview theme={theme} useGradient={useGradient} />}
                {previewMode === 'mobile' && <MobileAppPreview theme={theme} useGradient={useGradient} />}
                {previewMode === 'products' && <ProductCardPreview theme={theme} useGradient={useGradient} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </main>

      <AnimatePresence>{showExport && <ExportModal theme={theme} onClose={() => setShowExport(false)} />}</AnimatePresence>

      <AnimatePresence>
        {activeMapperIndex !== null && extractedColors[activeMapperIndex] && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveMapperIndex(null)} style={{ position: 'fixed', inset: 0, zIndex: -1, background: isDarkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.45)', backdropFilter: 'blur(16px)' }} />
            <div style={{ position: 'relative' }}>
              <RoleMapper color={extractedColors[activeMapperIndex].hex} onMap={(role) => handleConfigUpdate({ [role]: extractedColors[activeMapperIndex].hex })} onClose={() => setActiveMapperIndex(null)} isDarkMode={isDarkMode} />
            </div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {lastCopiedHex && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.8 }} className="copy-toast" style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: '#000', color: '#fff', padding: '12px 24px', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', zIndex: 10000 }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: lastCopiedHex }} />
            COPIED: <span style={{ opacity: 0.6, fontFamily: 'monospace' }}>{lastCopiedHex.toUpperCase()}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
