# 🦆 Duxel Studio — Visual Identity System

> **A professional-grade color palette generator and design system studio.**  
> Upload an image, search a color, or roll the dice — Duxel Studio builds your entire visual identity in seconds.

---

## ✨ Features

### 🎨 Color DNA Extraction
- Upload any image and extract its **top 5 dominant colors** using a K-Means++ clustering algorithm in perceptual OKLCH color space
- Interactive **Dominance Hierarchy Bar** shows each color's pixel weight across the image
- **Latent DNA Discovery** reveals up to 24 rare secondary shades hidden in your image
- Click any extracted color to **map it to a design role** (Primary, Secondary, Accent, Background, Surface) via the Role Mapper overlay

### 🔍 Smart Color Search
- Search by **color name**, **HEX**, **RGB**, or **CMYK** — supports 800+ designer-grade color names
- Instantly generates a full theme from any valid color input

### 🌗 Theme Generation
- **5 design roles** per theme: Hero Primary, Secondary, Accent, Base, Surface
- Full **shade scales** generated for each role (50–950)
- One-click **Night Mode** generation — automatically derives a dark variant of your current palette
- **Surprise** button for instant random theme generation
- **Gradient / Solid** toggle for all preview mockups
- Full **Undo / Redo** history

### 👁️ Live Preview Mockups
Switch between 4 animated preview modes to see your theme in context:
| Mode | Description |
|------|-------------|
| **Storefront Story** | Landing page hero with CTAs |
| **Community Journal** | Dashboard / analytics UI |
| **Mobile App** | iOS-style app shell |
| **Product Grid** | E-commerce card layout |

### 💾 Save & Export
- **Save Studio** — name and persist any theme to `localStorage`
- **Export Code** — exports your palette as:
  - CSS Custom Properties
  - JSON Design Tokens
  - SVG Swatches
  - Figma-ready Token format
- **URL sharing** — themes are encoded into URL query parameters for easy sharing
- **Copy HEX** — right-click any swatch or click on the bar to copy its hex code instantly

### 🎯 Harmony Explorer
- Explore color relationships: Complementary, Triadic, Analogous, Split-Complementary, and more
- One-click to apply any harmony variant to your active theme

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Animations | Framer Motion |
| Color Science | Chroma.js (OKLCH, LAB, contrast) |
| Color Extraction | node-vibrant + custom K-Means++ |
| Icons | Lucide React |
| Styling | Vanilla CSS with CSS Custom Properties |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ColorPicker.tsx        # Inline color role editor
│   ├── PaletteDisplay.tsx     # Shade scale column
│   ├── HarmonyExplorer.tsx    # Color harmony relationships
│   ├── PreviewDashboard.tsx   # Dashboard mockup
│   ├── LandingPagePreview.tsx # Landing page mockup
│   ├── MobileAppPreview.tsx   # Mobile app mockup
│   ├── ProductCardPreview.tsx # Product grid mockup
│   ├── ExportModal.tsx        # Export panel
│   └── SavedPalettes.tsx      # Saved themes shelf
├── utils/
│   └── palette.ts             # Theme generation, extraction, color math
├── App.tsx                    # Root application
└── App.css                    # Design system & global styles
public/
├── duck1.png                  # Logo asset
├── duck5.png                  # Decorative sticker
├── fish.png                   # Decorative sticker
└── steps.png                  # Decorative sticker
```

---

## 🎮 How to Use

1. **Upload a source image** — click "Upload Source" and choose any photo. Duxel will extract and synthesize a full 5-role palette.
2. **Search a color** — type any color name, HEX (`#3a7bd5`), RGB (`rgb(58,123,213)`), or CMYK into the search bar.
3. **Customize roles** — tap any color swatch in the Color Picker to fine-tune individual roles.
4. **Map latent shades** — click any swatch in the "Rare Findings" section to assign it to a design role.
5. **Preview your theme** — switch between the 4 mockup modes to validate your palette in real UI contexts.
6. **Export** — click "Export Code" to copy your palette as CSS, JSON tokens, or SVG.

---

## 📄 License

Private project. All rights reserved.
