import React from 'react';
import { motion } from 'framer-motion';
import { getContrastColor } from '../utils/palette';

interface EnergyTokenProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  index: number;
}

const EnergyToken: React.FC<EnergyTokenProps> = ({ label, color, onChange, index }) => {
  const contrastColor = getContrastColor(color);
  // Pick a blob class based on index
  const blobClass = `blob-${(index % 3) + 1}`;
  
  return (
    <motion.div 
      className={`energy-token ${blobClass}`}
      whileHover={{ scale: 1.1, rotate: index % 2 === 0 ? 5 : -5 }}
      whileTap={{ scale: 0.9 }}
      style={{
        width: '100px',
        height: '100px',
        background: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-primary)',
        position: 'relative',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <input 
        type="color" 
        value={color} 
        onChange={(e) => onChange(e.target.value)}
        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
      />
      <span style={{ 
        fontSize: '0.625rem', 
        fontWeight: 800, 
        color: contrastColor, 
        opacity: 0.8,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>{label}</span>
      <span style={{ 
        fontSize: '1.25rem', 
        fontWeight: 700, 
        color: contrastColor,
        fontFamily: 'Amatic SC'
      }}>{color.toUpperCase()}</span>
    </motion.div>
  );
};

interface ColorPickerProps {
  config: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
  };
  onChange: (key: string, color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ config, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem 0' }}>
      <EnergyToken index={0} label="Primary" color={config.primary} onChange={(c) => onChange('primary', c)} />
      <EnergyToken index={1} label="Secondary" color={config.secondary} onChange={(c) => onChange('secondary', c)} />
      <EnergyToken index={2} label="Accent" color={config.accent} onChange={(c) => onChange('accent', c)} />
      <EnergyToken index={3} label="Background" color={config.background} onChange={(c) => onChange('background', c)} />
      <EnergyToken index={4} label="Surface" color={config.surface} onChange={(c) => onChange('surface', c)} />
    </div>
  );
};
