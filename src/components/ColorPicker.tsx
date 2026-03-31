import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContrastColor, validateColor } from '../utils/palette';
import { Pipette } from 'lucide-react';

interface EnergyTokenProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  index: number;
  condensed?: boolean;
}

const EnergyToken: React.FC<EnergyTokenProps> = ({ label, color, onChange, index, condensed = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempHex, setTempHex] = useState(color.toUpperCase());

  useEffect(() => {
    setTempHex(color.toUpperCase());
  }, [color]);

  const contrastColor = getContrastColor(color);
  const blobClass = `blob-${(index % 3) + 1}`;

  const handleBlur = () => {
    const valid = validateColor(tempHex);
    if (valid) {
      onChange(valid);
    } else {
      setTempHex(color.toUpperCase());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setTempHex(color.toUpperCase());
      setIsEditing(false);
    }
  };

  const size = condensed ? '80px' : '120px';
  const labelSize = condensed ? '0.55rem' : '0.65rem';
  const hexSize = condensed ? '0.85rem' : '1.2rem';
  const iconSize = condensed ? 12 : 14;

  return (
    <motion.div
      className={`energy-token ${blobClass}`}
      whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 3 : -3 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: size,
        height: size,
        background: color,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: condensed ? '0 8px 24px rgba(0,0,0,0.1)' : 'var(--shadow-primary)',
        position: 'relative',
        border: '1px solid rgba(0,0,0,0.05)',
        transition: 'background 0.4s ease',
        flexShrink: 0
      }}
    >
      {/* Traditional Picker Trigger */}
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          cursor: 'pointer',
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <span style={{
          fontSize: labelSize,
          fontWeight: 900,
          color: contrastColor,
          opacity: 0.6,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: condensed ? '2px' : '4px'
        }}>{label}</span>

        {isEditing ? (
          <input
            autoFocus
            type="text"
            value={tempHex}
            onChange={(e) => setTempHex(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'inherit',
              fontSize: hexSize,
              fontWeight: 900,
              fontFamily: 'monospace',
              width: '100%',
              textAlign: 'center',
              cursor: 'text',
              outline: 'none',
              padding: condensed ? '0.1rem 0' : '0.2rem 0',
              borderRadius: '4px',
              transition: 'background 0.2s',
              pointerEvents: 'auto',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          />
        ) : (
          <span
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsEditing(true);
            }}
            style={{
              fontSize: hexSize,
              fontWeight: 900,
              color: contrastColor,
              fontFamily: 'monospace',
              cursor: 'text',
              pointerEvents: 'auto',
            }}
          >
            {color.toUpperCase()}
          </span>
        )}

        <div style={{ marginTop: condensed ? '4px' : '8px', opacity: 0.4 }}>
          <Pipette size={iconSize} color={contrastColor} />
        </div>
      </div>
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
  condensed?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ config, onChange, condensed = false }) => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: condensed ? '0.75rem' : '2.5rem', 
      padding: condensed ? '0.5rem 0' : '2.5rem 0', 
      justifyContent: condensed ? 'flex-start' : 'center', 
      flexWrap: 'wrap' 
    }}>
      <EnergyToken index={0} label="Hero" color={config.primary} onChange={(c) => onChange('primary', c)} condensed={condensed} />
      <EnergyToken index={1} label="Draft" color={config.secondary} onChange={(c) => onChange('secondary', c)} condensed={condensed} />
      <EnergyToken index={2} label="Pulse" color={config.accent} onChange={(c) => onChange('accent', c)} condensed={condensed} />
      <EnergyToken index={3} label="Base" color={config.background} onChange={(c) => onChange('background', c)} condensed={condensed} />
      <EnergyToken index={4} label="Surface" color={config.surface} onChange={(c) => onChange('surface', c)} condensed={condensed} />
    </div>
  );
};

