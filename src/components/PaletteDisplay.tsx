import React, { useState } from 'react';
import type { Palette } from '../utils/palette';
import { motion, AnimatePresence } from 'framer-motion';

interface PaletteDisplayProps {
  palette: Palette;
  title?: string;
}

export const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ palette, title = 'Color Story' }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (hex: string, index: number) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hex).then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = hex;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1500);
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Amatic SC', color: 'var(--text-primary)' }}>{title}</h2>
        <div className="organic-divider" style={{ margin: 0, flex: 1 }} />
      </div>
      
      <div style={{ position: 'relative' }}>
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
            position: 'relative'
          }}>
            {palette.map((shade, index) => (
              <motion.div
                key={shade.shade}
                onClick={() => copyToClipboard(shade.hex, index)}
                whileHover="hover"
                whileTap={{ scale: 0.9 }}
                style={{
                  width: '80px',
                  height: '80px',
                  background: shade.hex,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  borderRadius: '12px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  overflow: 'hidden'
                }}
              >
                {/* Hover Interaction Overlay */}
                <motion.div
                  variants={{
                    initial: { opacity: 0, scale: 0.8 },
                    hover: { opacity: 1, scale: 1 }
                  }}
                  initial="initial"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    gap: '4px',
                    backdropFilter: 'blur(2px)',
                    zIndex: 2
                  }}
                >
                   <motion.span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Copy</motion.span>
                   <motion.span style={{ fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>HEX</motion.span>
                </motion.div>

                <AnimatePresence>
                  {copiedIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.5, y: -10 }}
                      className="label-sticker"
                      style={{
                        position: 'absolute',
                        zIndex: 100,
                        pointerEvents: 'none',
                        background: 'var(--text-primary)',
                        color: 'white',
                        transform: 'none',
                        fontSize: '0.75rem',
                        padding: '0.5rem 1rem',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                      }}
                    >
                      COPIED!
                    </motion.div>
                  )}
                </AnimatePresence>
                <span style={{ 
                  fontSize: '0.625rem', 
                  fontWeight: 800, 
                  color: 'rgba(0,0,0,0.2)',
                  userSelect: 'none',
                  fontFamily: 'Nunito'
                }}>
                  {shade.shade}
                </span>
              </motion.div>
            ))}
          </div>
          
          <div style={{ marginTop: '1rem', textAlign: 'center', opacity: 0.3, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>
             (CLICK ANY SHADE ABOVE TO COPY HEX CODE)
          </div>
      </div>
    </div>
  );
};
