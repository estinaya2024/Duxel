import React from 'react';
import { motion } from 'framer-motion';
import { Trash } from 'lucide-react';
import type { ThemeConfig } from '../utils/palette';

interface SavedTheme {
  id: string;
  name: string;
  config: ThemeConfig;
  timestamp: number;
}

interface SavedPalettesProps {
  themes: SavedTheme[];
  onSelect: (config: ThemeConfig) => void;
  onRemove: (id: string) => void;
}

export const SavedPalettes: React.FC<SavedPalettesProps> = ({ themes, onSelect, onRemove }) => {
  if (themes.length === 0) return null;

  return (
    <div style={{ padding: '2rem 4rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {themes.map((t, i) => (
          <motion.div 
            key={t.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 300, delay: i * 0.05 }}
            whileHover={{ y: -4, background: 'var(--bg-tertiary)' }}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem', 
              background: 'rgba(255,255,255,0.03)', padding: '0.6rem 1.25rem', 
              borderRadius: '16px', border: '1px solid var(--border-subtle)',
              cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            onClick={() => onSelect(t.config)}
          >
            <div style={{ display: 'flex', gap: '3px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.config.primary }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.config.secondary }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.config.accent }} />
            </div>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.name}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(t.id); }}
              style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: '0.4rem', borderRadius: '8px' }}
              onMouseEnter={e => e.currentTarget.style.color = '#ff4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Trash size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
