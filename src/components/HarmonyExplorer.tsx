import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { HarmonyRule, ThemeConfig } from '../utils/palette';
import { applyHarmonyRule } from '../utils/palette';
import { Sparkles } from 'lucide-react';

interface HarmonyExplorerProps {
  config: ThemeConfig;
  onUpdate: (newPartialConfig: Partial<ThemeConfig>) => void;
}

const RULES: { rule: HarmonyRule; label: string; desc: string }[] = [
  { rule: 'monochromatic', label: 'Monochromatic', desc: 'Same hue, varied lightness' },
  { rule: 'analogous',     label: 'Analogous',     desc: '±30° neighboring hues' },
  { rule: 'complementary', label: 'Complementary', desc: '180° opposite on the wheel' },
  { rule: 'triadic',       label: 'Triadic',       desc: '120° equidistant hues' },
];

export const HarmonyExplorer: React.FC<HarmonyExplorerProps> = ({ config, onUpdate }) => {
  const [activeRule, setActiveRule] = useState<HarmonyRule | null>(null);

  const applyRule = (rule: HarmonyRule) => {
    const result = applyHarmonyRule(config.primary, rule);
    onUpdate({ secondary: result.secondary, accent: result.accent });
    setActiveRule(rule);
  };

  // Preview swatches per rule
  const getRulePreview = (rule: HarmonyRule) => {
    try {
      const result = applyHarmonyRule(config.primary, rule);
      return [config.primary, result.secondary, result.accent];
    } catch {
      return [config.primary, config.secondary, config.accent];
    }
  };

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid var(--border-light)',
        padding: '1.75rem 2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            background: `${config.primary}15`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: config.primary,
          }}
        >
          <Sparkles size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-primary)' }}>
            Color Harmony Explorer
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700 }}>
            Mathematically perfect secondary & accent from your primary
          </div>
        </div>
      </div>

      <div className="harmony-explorer-grid">
        {RULES.map(({ rule, label, desc }) => {
          const preview = getRulePreview(rule);
          const isActive = activeRule === rule;

          return (
            <motion.button
              key={rule}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => applyRule(rule)}
              style={{
                background: isActive ? `${config.primary}12` : '#f9f9f9',
                border: `2px solid ${isActive ? config.primary : 'transparent'}`,
                borderRadius: '16px',
                padding: '1.25rem 1rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'border-color 0.2s',
              }}
            >
              {/* Mini palette preview */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {preview.map((hex, i) => (
                  <div
                    key={i}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: hex,
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    }}
                  />
                ))}
              </div>

              <div>
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    color: isActive ? config.primary : 'var(--text-primary)',
                    lineHeight: 1.2,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: '4px', fontWeight: 700 }}>
                  {desc}
                </div>
              </div>

              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '50px',
                    fontSize: '0.6rem',
                    fontWeight: 900,
                    background: config.primary,
                    color: 'white',
                    letterSpacing: '0.05em',
                  }}
                >
                  APPLIED
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
