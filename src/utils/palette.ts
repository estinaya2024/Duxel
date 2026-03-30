import chroma from 'chroma-js';
import { Vibrant } from 'node-vibrant/browser';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  moodName?: string;
}

export interface ColorShade {
  shade: string;
  hex: string;
}

export type Palette = ColorShade[];

export interface FullTheme {
  config: ThemeConfig;
  palettes: {
    primary: Palette;
    secondary: Palette;
    accent: Palette;
  };
}

// 2024-2026 Elite Aesthetic Archetypes (50+ Massive Library)
const PRO_ARCHETYPES = [
  // --- Luxury & Editorial ---
  { name: 'Mocha Mousse', p: '#8B5E3C', s: '#E3CCB2', a: '#F5F5DC' },
  { name: 'Platinum Slate', p: '#2C3E50', s: '#BDC3C7', a: '#F9F9F9' },
  { name: 'Cloud Gold', p: '#FDFDFD', s: '#E0E0E0', a: '#D4AF37' },
  { name: 'Onyx Minimal', p: '#0F0F0F', s: '#303030', a: '#FFFFFF' },
  { name: 'Midnight Opulence', p: '#1A1A2E', s: '#16213E', a: '#EFC07B' },
  { name: 'Emerald Prestige', p: '#0D4C3C', s: '#2D5A4A', a: '#7BA05B' },
  { name: 'Wine & Silk', p: '#4A0E0E', s: '#E5D3D0', a: '#B8860B' },
  { name: 'Ivory Studio', p: '#FFFFF0', s: '#A8A8A8', a: '#2D2D2D' },
  { name: 'Charcoal Navy', p: '#121212', s: '#243447', a: '#C0C0C0' },
  { name: 'Velvet Rose', p: '#6D214F', s: '#F8EFBA', a: '#FC427B' },

  // --- Retro Cyber & Futurism ---
  { name: 'Cyber Lavender', p: '#7161EF', s: '#DEC0F1', a: '#95E06C' },
  { name: 'Future Dusk', p: '#4C5578', s: '#E6E6FA', a: '#B8C1D6' },
  { name: 'Neon Alley', p: '#0B0D17', s: '#FF2DAA', a: '#00E5FF' },
  { name: 'Holo Noir', p: '#0A0F1E', s: '#B8B8FF', a: '#FF4FD8' },
  { name: 'Laser Green', p: '#050505', s: '#2EF9B6', a: '#FF0055' },
  { name: 'Digital Sky', p: '#1DA1F2', s: '#E1E8ED', a: '#FFAD1F' },
  { name: 'Solarized Indigo', p: '#002B36', s: '#93A1A1', a: '#268BD2' },
  { name: 'Static Noise', p: '#222222', s: '#666666', a: '#00FF00' },
  { name: 'Electric Royal', p: '#0052cc', s: '#e6f0ff', a: '#ffcc00' },
  { name: 'Glow Drift', p: '#111111', s: '#222222', a: '#FF00FF' },

  // --- Eco, Nature & Earth ---
  { name: 'Forest Floor', p: '#344E41', s: '#A3B18A', a: '#4AAFD5' },
  { name: 'Rustic Terracotta', p: '#A0522D', s: '#E87A5D', a: '#FBEAE7' },
  { name: 'Sage & Slate', p: '#8A9A5B', s: '#F1F1F1', a: '#303030' },
  { name: 'Cider Night', p: '#4A3728', s: '#BF624C', a: '#E5BA9E' },
  { name: 'Mossy Rock', p: '#4B5320', s: '#F2E8E4', a: '#BC8034' },
  { name: 'Nordic Sea', p: '#1B263B', s: '#415A77', a: '#E0E1DD' },
  { name: 'Honey & Stone', p: '#B99470', s: '#F5F5DC', a: '#333333' },
  { name: 'Amber Glow', p: '#FFBF00', s: '#1A1A1A', a: '#FF7E00' },
  { name: 'Desert Mirage', p: '#E2725B', s: '#F4A460', a: '#2F4F4F' },
  { name: 'Clay & Linen', p: '#966F33', s: '#EFEFEF', a: '#4A4A4A' },

  // --- Industrial & Raw ---
  { name: 'Concrete Safety', p: '#2D2D2D', s: '#D4D4D4', a: '#FF7F00' },
  { name: 'Steel Core', p: '#4682B4', s: '#B0C4DE', a: '#191970' },
  { name: 'Matte Asphalt', p: '#1C1C1C', s: '#3D3D3D', a: '#E5E5E5' },
  { name: 'Bunker Noir', p: '#000000', s: '#121212', a: '#FF0000' },
  { name: 'Graphite Ink', p: '#151515', s: '#AFAFAF', a: '#00FFFF' },

  // --- Soft, Fondant & Ethereal ---
  { name: 'Fondant Pastel', p: '#FFB7B2', s: '#FFDAC1', a: '#E2F0CB' },
  { name: 'Iridescent Mist', p: '#B0E0E6', s: '#EEF8FA', a: '#B8B8FF' },
  { name: 'Misty Lavender', p: '#9D8DF1', s: '#F0E6FF', a: '#4A4E69' },
  { name: 'Petal Soft', p: '#F2E8E4', s: '#D8E2DC', a: '#B8C1D6' },
  { name: 'Marshmallow', p: '#F6E8EA', s: '#EFE6DD', a: '#D8DBE2' },
  { name: 'Aqua Shimmer', p: '#72C8D2', s: '#F0FFFF', a: '#4682B4' },
  { name: 'Peach fuzz', p: '#FFBE98', s: '#F8EDEB', a: '#A0522D' },
  { name: 'Cotton Candy', p: '#FFC0CB', s: '#E0FFFF', a: '#9370DB' },
  { name: 'Blush Editorial', p: '#E56B6F', s: '#FFEAEE', a: '#355070' },
  { name: 'Ivory Coast', p: '#F5F5DC', s: '#E9DCC9', a: '#C2B280' },

  // --- Cinema & Riso ---
  { name: 'Film Grain', p: '#3E4E50', s: '#FACFAD', a: '#F23030' },
  { name: 'Analog Sunset', p: '#FF7E5F', s: '#FEB47B', a: '#3B3B3B' },
  { name: 'Riso Blue', p: '#00BFFF', s: '#FFFFFF', a: '#FF007F' },
  { name: 'Washed Indigo', p: '#4B0082', s: '#E6E6FA', a: '#808080' },
  { name: 'Sepia Studio', p: '#704214', s: '#F5DEB3', a: '#1A1A1A' },

  // --- Pinterest Vibes & Botanicals ---
  { name: 'Seal & Satin', p: '#6B2717', s: '#CC9E4C', a: '#E0D0B6' },
  { name: 'Russian Sage', p: '#30253E', s: '#C3C88C', a: '#80B9B1' },
  { name: 'Wild Bamboo', p: '#667436', s: '#FFEC8E', a: '#D9828D' },
  { name: 'Arsenic & Morning', p: '#4D2308', s: '#8B9B93', a: '#CFCFCD' },

  // --- Pinterest 2025 Editorial Update ---
  { name: 'Champagne Velvet', p: '#F7E7CE', s: '#8E7618', a: '#C0C0C0' },
  { name: 'Alabaster & Ash', p: '#F2F0EB', s: '#B2BEB5', a: '#4B4B4B' },
  { name: 'Soft Charcoal', p: '#333333', s: '#E1E1E1', a: '#C9A0DC' },
  { name: 'Holo Noir', p: '#111111', s: '#00CED1', a: '#DA70D6' },
  { name: 'Laser Green Pro', p: '#39FF14', s: '#111111', a: '#A9A9A9' },
  { name: 'Terra & Teal', p: '#E2725B', s: '#008080', a: '#F4EBD0' },
  { name: 'Film Grain Red', p: '#800000', s: '#F5F5F5', a: '#36454F' },
  { name: 'Matte Mid-Century', p: '#A52A2A', s: '#F0E68C', a: '#5F9EA0' },
  { name: 'Vibrant Riso', p: '#FF1493', s: '#FF8C00', a: '#1E90FF' },
  { name: 'Midnight Velvet', p: '#1A1A2E', s: '#EFC07B', a: '#16213E' },
  { name: 'Emerald & Ivory', p: '#0D4C3C', s: '#F4F1EB', a: '#7BA05B' },
  { name: 'Mocha Luxury', p: '#B08B57', s: '#4A3728', a: '#E3DAC9' },

  // --- Deep Aesthetic Diver (v2 Research) ---
  // Dark Academia
  { name: 'AESTHETIC ', p: '#5D3A29', s: '#2B1B17', a: '#8C7262' },
  { name: 'Velvet Study', p: '#3C1E1E', s: '#1A1211', a: '#6E533A' },
  { name: 'Scholar\'s Ink', p: '#232D3F', s: '#1A1A1A', a: '#AAB8BB' },
  { name: 'Secret Archive', p: '#3B2F2F', s: '#1A1313', a: '#C09876' },
  // Riso-Print
  { name: 'Riso Fluorescent', p: '#FF4ACF', s: '#00A693', a: '#FFDE00' },
  { name: 'Ink Drift', p: '#0047AB', s: '#FFFFFF', a: '#FF3131' },
  { name: 'Layered Soy', p: '#6347FF', s: '#FF6B35', a: '#F7C59F' },
  { name: 'Stencil Shadow', p: '#3E3E3E', s: '#FF5733', a: '#C70039' },
  // Neo-Brutalist
  { name: 'Raw Concrete', p: '#A8A8A8', s: '#000000', a: '#FFFF00' },
  { name: 'Structural Ember', p: '#E23E57', s: '#311D3F', a: '#88304E' },
  { name: 'Asphalt Core', p: '#212121', s: '#FFFFFF', a: '#00FF41' },
  { name: 'Grid Logic', p: '#0000FF', s: '#111111', a: '#F0F0F0' },
  // Ethereal Iridescence
  { name: 'Pearl Essence', p: '#E0C3FC', s: '#8EC5FC', a: '#FFFFFF' },
  { name: 'Prism Glow', p: '#FFD1FF', s: '#FEE140', a: '#FAACA8' },
  { name: 'Nebula Soft', p: '#A18CD1', s: '#FBC2EB', a: '#84FAB0' },
  { name: 'Glass Prism', p: '#CFD9DF', s: '#E2E2E2', a: '#667EEA' },
  // Mediterranean Minimal
  { name: 'Olive Terracotta', p: '#708238', s: '#E2725B', a: '#F5F5DC' },
  { name: 'Aegean Bone', p: '#005F73', s: '#F1FAEE', a: '#E9C46A' },
  { name: 'Sunkissed Sage', p: '#A3B18A', s: '#588157', a: '#DAD7CD' },
  { name: 'Linen Shore', p: '#D6CCC2', s: '#F5EBE0', a: '#E3D5CA' }
];

export const getRandomTheme = (): ThemeConfig => {
  const archetype = PRO_ARCHETYPES[Math.floor(Math.random() * PRO_ARCHETYPES.length)];
  const isDark = chroma(archetype.p).luminance() < 0.2;

  return {
    primary: archetype.p,
    secondary: archetype.s,
    accent: archetype.a,
    background: isDark ? '#0f0f12' : '#faf9f6',
    surface: isDark ? '#1a1a1f' : '#ffffff',
    moodName: archetype.name
  };
};

export const detectMoodFromPalette = (primaryHex: string): string => {
  const c = chroma(primaryHex);
  const h = c.get('hsl.h');
  const s = c.get('hsl.s');
  const l = c.get('hsl.l');

  if (s < 0.1) return 'Industrial Mono';
  if (l < 0.15) return 'Midnight Deep';
  if (h > 40 && h < 100) return 'Organic Earth';
  if (h > 180 && h < 260) return 'Cool Horizon';
  if (h > 300 || h < 20) return 'Bold Editorial';
  if (s > 0.8) return 'Vibrant Pop';

  return 'Curated Aesthetic';
};

export const generateThemeFromSeed = (seedColor: string): ThemeConfig => {
  const base = chroma(seedColor);
  const h = base.get('hsl.h');
  const s = base.get('hsl.s');

  const proPrimary = s > 0.8 ? base.desaturate(0.3).hex() : base.hex();
  const primary = chroma(proPrimary);

  const secondary = primary.set('hsl.h', h + 25).desaturate(0.4).brighten(0.4);
  const accent = primary.set('hsl.h', h + 150).saturate(0.2);

  const isDark = primary.luminance() < 0.2;

  return {
    primary: primary.hex(),
    secondary: secondary.hex(),
    accent: accent.hex(),
    background: isDark ? '#0f0f12' : '#faf9f6',
    surface: isDark ? '#1a1a1f' : '#ffffff',
    moodName: detectMoodFromPalette(primary.hex())
  };
};

// NATIVE CANVAS FALLBACK (The 100% Guaranteed Extractor)
const extractColorsViaCanvas = (imageUrl: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(['#7c9473', '#cfd8d7', '#4a5d4e']);

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Sample 3 random points for Primary, Secondary, Accent
      const points = [
        { x: Math.floor(canvas.width * 0.5), y: Math.floor(canvas.height * 0.5) }, // Center
        { x: Math.floor(canvas.width * 0.2), y: Math.floor(canvas.height * 0.2) }, // Top-Left
        { x: Math.floor(canvas.width * 0.8), y: Math.floor(canvas.height * 0.8) }  // Bottom-Right
      ];

      const colors = points.map(p => {
        const [r, g, b] = ctx.getImageData(p.x, p.y, 1, 1).data;
        return chroma(r, g, b).hex();
      });

      resolve(colors);
    };
    img.onerror = () => resolve(['#7c9473', '#cfd8d7', '#4a5d4e']);
    img.src = imageUrl;
  });
};

export const extractPinterestTheme = async (file: File): Promise<ThemeConfig> => {
  const imageUrl = URL.createObjectURL(file);
  try {
    // 1. Attempt AI-grade extraction (node-vibrant)
    const palette = await Vibrant.from(imageUrl).getPalette();

    const pStr = palette.Vibrant?.hex || palette.DarkVibrant?.hex || '#7c9473';
    const sStr = palette.LightVibrant?.hex || palette.Muted?.hex ||
      chroma(pStr).set('hsl.h', chroma(pStr).get('hsl.h') + 30).hex();
    const aStr = palette.DarkMuted?.hex || palette.DarkVibrant?.hex ||
      chroma(pStr).set('hsl.h', chroma(pStr).get('hsl.h') + 180).hex();

    const primary = chroma(pStr);
    const isDark = primary.luminance() < 0.15;

    const muted = palette.Muted || palette.LightMuted;
    let bg = isDark ? '#0f0f12' : '#faf9f6';
    let surface = isDark ? '#1a1a1f' : '#ffffff';

    if (muted) {
      const m = chroma(muted.hex);
      bg = isDark ? m.darken(4.5).desaturate(4).hex() : m.brighten(4.5).desaturate(4).hex();
      surface = isDark ? m.darken(4).desaturate(3).hex() : m.brighten(4.3).desaturate(3).hex();
    }

    return {
      primary: pStr,
      secondary: sStr,
      accent: aStr,
      background: bg,
      surface: surface,
      moodName: detectMoodFromPalette(pStr)
    };
  } catch (error) {
    // 2. Fail-Safe: Switch to Native Canvas Extraction
    const [p, s, a] = await extractColorsViaCanvas(imageUrl);
    return {
      ...generateThemeFromSeed(p),
      secondary: s,
      accent: a,
      moodName: detectMoodFromPalette(p)
    };
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
};

export const generatePalette = (color: string): Palette => {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const colors = chroma.scale(['#fff', color, '#000']).mode('lch').colors(12);

  return shades.map((shade, i) => ({
    shade: shade.toString(),
    hex: colors[i + 1]
  }));
};

export const getFullTheme = (config: ThemeConfig): FullTheme => {
  return {
    config,
    palettes: {
      primary: generatePalette(config.primary),
      secondary: generatePalette(config.secondary),
      accent: generatePalette(config.accent),
    }
  };
};

export const getContrastColor = (hex: string): string => {
  return chroma(hex).luminance() > 0.45 ? '#222222' : '#ffffff';
};

// ────────────────────────────────────────────────────────
// Dark Theme Auto-Generator
// ────────────────────────────────────────────────────────
export const generateDarkTheme = (config: ThemeConfig): ThemeConfig => {
  const p = chroma(config.primary);
  const h = p.get('hsl.h');
  const s = p.get('hsl.s');

  // Tint background slightly with primary hue
  const bgTint = chroma.hsl(h, Math.min(s * 0.3, 0.08), 0.07).hex();
  const surfaceTint = chroma.hsl(h, Math.min(s * 0.25, 0.06), 0.11).hex();

  // Keep primary but slightly brighter for dark bg readability
  const primaryDark = p.luminance() < 0.08
    ? p.brighten(1.5).hex()
    : config.primary;

  return {
    ...config,
    primary: primaryDark,
    background: bgTint,
    surface: surfaceTint,
    moodName: (config.moodName || 'Dark') + ' · Night Mode',
  };
};

// ────────────────────────────────────────────────────────
// Color Harmony Rules
// ────────────────────────────────────────────────────────
export type HarmonyRule = 'monochromatic' | 'analogous' | 'complementary' | 'triadic';

export const applyHarmonyRule = (
  primary: string,
  rule: HarmonyRule
): Pick<ThemeConfig, 'secondary' | 'accent'> => {
  const p = chroma(primary);
  const h = p.get('hsl.h');
  const s = p.get('hsl.s');
  const l = p.get('hsl.l');

  switch (rule) {
    case 'monochromatic':
      return {
        secondary: chroma.hsl(h, s * 0.6, Math.min(l + 0.25, 0.9)).hex(),
        accent: chroma.hsl(h, s * 0.4, Math.min(l + 0.45, 0.95)).hex(),
      };
    case 'analogous':
      return {
        secondary: chroma.hsl((h + 30) % 360, s * 0.8, l).hex(),
        accent: chroma.hsl((h - 30 + 360) % 360, s * 0.7, Math.min(l + 0.1, 0.9)).hex(),
      };
    case 'complementary':
      return {
        secondary: chroma.hsl((h + 180) % 360, s * 0.8, Math.min(l + 0.1, 0.9)).hex(),
        accent: chroma.hsl((h + 180) % 360, s * 0.5, Math.min(l + 0.25, 0.95)).hex(),
      };
    case 'triadic':
      return {
        secondary: chroma.hsl((h + 120) % 360, s * 0.9, l).hex(),
        accent: chroma.hsl((h + 240) % 360, s * 0.85, Math.min(l + 0.05, 0.9)).hex(),
      };
    default:
      return { secondary: primary, accent: primary };
  }
};

// ────────────────────────────────────────────────────────
// ASE (Adobe Swatch Exchange) Binary Builder
// ────────────────────────────────────────────────────────
export const buildASEBuffer = (config: ThemeConfig): ArrayBuffer => {
  const colors: Array<{ name: string; hex: string }> = [
    { name: 'Primary', hex: config.primary },
    { name: 'Secondary', hex: config.secondary },
    { name: 'Accent', hex: config.accent },
    { name: 'Background', hex: config.background },
    { name: 'Surface', hex: config.surface },
  ];

  // Each color block: 4 (type) + 4 (length) + name(utf16) + 4 (null) + 2 (colorspace) + 12 (RGB floats) + 2 (type)
  const encodeBlock = (name: string, hex: string): number[] => {
    const rgb = chroma(hex).rgb();
    const nameEncoded: number[] = [];
    for (let i = 0; i < name.length; i++) {
      nameEncoded.push(0, name.charCodeAt(i));
    }
    nameEncoded.push(0, 0); // null terminator

    const nameLen = nameEncoded.length; // in bytes

    // Color block length = 2 (name len) + nameLen + 4 (color model) + 12 (floats) + 2 (color type)
    const blockDataLen = 2 + nameLen + 4 + 12 + 2;

    const block: number[] = [
      0x00, 0x01, // block type: color entry
      (blockDataLen >> 24) & 0xff,
      (blockDataLen >> 16) & 0xff,
      (blockDataLen >> 8) & 0xff,
      blockDataLen & 0xff,
      (nameLen / 2 + 1) >> 8, (nameLen / 2 + 1) & 0xff, // name length in UTF-16 chars
      ...nameEncoded,
      0x52, 0x47, 0x42, 0x20, // 'RGB '
    ];

    // 3 x float32 RGB (0-1)
    for (const channel of rgb) {
      const f = channel / 255;
      const view = new DataView(new ArrayBuffer(4));
      view.setFloat32(0, f, false);
      block.push(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3));
    }
    block.push(0x00, 0x02); // color type: normal
    return block;
  };

  const allBlocks: number[] = [];
  for (const c of colors) {
    allBlocks.push(...encodeBlock(c.name, c.hex));
  }

  // ASE header
  const header = [
    0x41, 0x53, 0x45, 0x46, // 'ASEF'
    0x00, 0x01, 0x00, 0x00, // version 1.0
    (colors.length >> 24) & 0xff,
    (colors.length >> 16) & 0xff,
    (colors.length >> 8) & 0xff,
    colors.length & 0xff,
  ];

  const full = [...header, ...allBlocks];
  const buf = new ArrayBuffer(full.length);
  const view = new Uint8Array(buf);
  full.forEach((b, i) => { view[i] = b; });
  return buf;
};
