import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ThemeConfig } from '../utils/palette';
import { getWCAGPairs } from '../utils/palette';
import { ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface WCAGAuditorProps {
  config: ThemeConfig;
}

const Badge: React.FC<{ pass: boolean; label: string }> = ({ pass, label }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 8px',
      borderRadius: '6px',
      fontSize: '0.65rem',
      fontWeight: 900,
      letterSpacing: '0.08em',
      background: pass ? '#d1fae5' : '#fee2e2',
      color: pass ? '#065f46' : '#991b1b',
      border: `1px solid ${pass ? '#6ee7b7' : '#fca5a5'}`,
    }}
  >
    {pass ? '✓' : '✗'} {label}
  </span>
);

export const WCAGAuditor: React.FC<WCAGAuditorProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pairs = getWCAGPairs(config);
  const totalPairs = pairs.length;
  const aaPassed = pairs.filter(p => p.aaNormal).length;
  const score = Math.round((aaPassed / totalPairs) * 100);

  const scoreColor = score >= 80 ? '#065f46' : score >= 50 ? '#92400e' : '#991b1b';
  const scoreBg = score >= 80 ? '#d1fae5' : score >= 50 ? '#fef3c7' : '#fee2e2';

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '20px',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
      }}
    >
      {/* Header Toggle */}
      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsOpen(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.5rem 2rem',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            <ShieldCheck size={20} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 900, fontSize: '1rem', color: 'var(--text-primary)' }}>
              WCAG 2.1 Contrast Auditor
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.5, fontWeight: 700 }}>
              {aaPassed}/{totalPairs} pairs pass AA standard
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '50px',
              fontSize: '0.8rem',
              fontWeight: 900,
              background: scoreBg,
              color: scoreColor,
            }}
          >
            {score}% AA Score
          </span>
          {isOpen ? <ChevronUp size={18} opacity={0.5} /> : <ChevronDown size={18} opacity={0.5} />}
        </div>
      </motion.button>

      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 2rem 2rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
              }}
            >
              {pairs.map((pair, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '14px',
                    background: pair.aaNormal ? '#f0fdf4' : pair.aaLarge ? '#fffbeb' : '#fef2f2',
                    border: `1px solid ${pair.aaNormal ? '#bbf7d0' : pair.aaLarge ? '#fde68a' : '#fecaca'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  {/* Color Preview Swatch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: pair.bg,
                        border: '1px solid rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '18px',
                          height: '4px',
                          background: pair.fg,
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, lineHeight: 1.2, color: '#111' }}>
                        {pair.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', opacity: 0.6, fontWeight: 700, fontFamily: 'monospace' }}>
                        {pair.ratio.toFixed(2)}:1
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    <Badge pass={pair.aaNormal} label="AA" />
                    <Badge pass={pair.aaLarge} label="AA Large" />
                    <Badge pass={pair.aaaNormal} label="AAA" />
                    <Badge pass={pair.aaaLarge} label="AAA Lg" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div
              style={{
                padding: '1.25rem 2rem',
                borderTop: '1px solid var(--border-light)',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap',
              }}
            >
              {[
                { label: 'AA Normal', value: '4.5:1+', desc: 'Body text' },
                { label: 'AA Large', value: '3:1+', desc: '18pt or bold 14pt' },
                { label: 'AAA Normal', value: '7:1+', desc: 'Enhanced' },
              ].map((item, i) => (
                <div key={i} style={{ fontSize: '0.72rem', fontWeight: 700, opacity: 0.55 }}>
                  <span style={{ fontWeight: 900, opacity: 1 }}>{item.label}</span>{' '}
                  {item.value} — {item.desc}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
