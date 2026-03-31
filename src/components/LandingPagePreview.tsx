import React from 'react';
import { motion } from 'framer-motion';
import type { FullTheme } from '../utils/palette';
import { getContrastColor } from '../utils/palette';
import { 
  ArrowRight, ArrowDown, 
  Layers, Zap, Shield, Globe, Menu
} from 'lucide-react';

interface LandingPagePreviewProps {
  theme: FullTheme;
  useGradient?: boolean;
}

const springConfig = { type: "spring" as const, damping: 25, stiffness: 120 };

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({ theme, useGradient = true }) => {
  const { config } = theme;
  const { primary, secondary, accent, background, surface } = config;
  
  const textOnPrimary = getContrastColor(primary);
  const textOnBackground = getContrastColor(background);

  return (
    <div style={{ 
      background: background, 
      color: textOnBackground, 
      overflow: 'hidden', 
      position: 'relative', 
      minHeight: '1200px',
      fontFamily: "'Nunito', sans-serif"
    }}>
      {/* Refined Ambient Background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '0%', right: '0%', width: '600px', height: '600px', background: `radial-gradient(circle, ${primary} 0%, transparent 70%)`, filter: 'blur(80px)' }} />
          <div style={{ position: 'absolute', bottom: '0%', left: '0%', width: '500px', height: '500px', background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Modern Minimal Nav */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 4rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
              <div style={{ width: '32px', height: '32px', background: primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textOnPrimary }}>
                <Layers size={18} />
              </div>
              <span>DUXEL<span style={{ fontWeight: 400, opacity: 0.5 }}>STUDIO</span></span>
           </div>
           
           <div className="landing-nav-links">
              <span style={{ cursor: 'pointer' }}>Process</span>
              <span style={{ cursor: 'pointer' }}>Projects</span>
              <span style={{ cursor: 'pointer' }}>Manifesto</span>
              <span style={{ cursor: 'pointer' }}>Contact</span>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <Menu size={24} style={{ cursor: 'pointer' }} />
           </div>
        </nav>

        {/* Hero Section - Professional Split Design */}
        <section className="landing-hero-layout" style={{ padding: '6rem 4rem 10rem' }}>
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ...springConfig, delay: 0.2 }}
          >
            <div className="label-sticker" style={{ background: primary, color: textOnPrimary, marginBottom: '2rem', transform: 'none', borderRadius: '4px' }}>
              NOW RECRUITING FOR 2026
            </div>
            <h2 style={{ fontSize: '5.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '2.5rem', letterSpacing: '-0.01em' }}>
              Elevate your <br /> 
              <span style={{ color: primary, fontFamily: "'Amatic SC', cursive" }}>digital presence.</span>
            </h2>
            <p style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: '540px', lineHeight: 1.6, marginBottom: '3.5rem' }}>
              We craft high-performance digital experiences and brand identities for founders who value craft, soul, and intentionality in every pixel.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
                <motion.button 
                   whileHover={{ x: 5 }}
                   style={{ 
                     display: 'flex', alignItems: 'center', gap: '1rem', 
                     padding: '1.2rem 2.8rem', background: primary, color: textOnPrimary,
                     borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '1.1rem',
                     boxShadow: `0 20px 40px -10px ${primary}40`
                   }}>
                   Start Project
                   <ArrowRight size={20} />
                </motion.button>
                <button style={{ 
                   padding: '1.2rem 2.8rem', background: 'transparent', color: textOnBackground,
                   borderRadius: '12px', border: `1px solid ${primary}40`, fontWeight: 800, fontSize: '1.1rem'
                }}>
                   View Work
                </button>
            </div>
          </motion.div>
          
          <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ ...springConfig, delay: 0.4 }}
             style={{ position: 'relative' }}
          >
             <div style={{ 
               background: surface, 
               borderRadius: '40px', 
               padding: '2rem', 
               boxShadow: 'var(--shadow-accent)',
               border: '1px solid var(--border-light)',
               position: 'relative',
               overflow: 'hidden'
             }}>
                {/* The Featured Duck - Professional Integration */}
                <div style={{ 
                  width: '100%', 
                  aspectRatio: '1/1', 
                  background: useGradient
                   ? `linear-gradient(135deg, ${secondary}30, ${accent}20)`
                   : `${secondary}30`,
                  borderRadius: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                   <motion.img 
                      animate={{ y: [0, -15, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                      src="/duck5.png" 
                      style={{ width: '85%', height: '85%', objectFit: 'contain' }} 
                      alt="Featured Duxel" 
                   />
                   
                   {/* Abstract Professional Accents */}
                   
                </div>
                
                <div style={{ padding: '2rem 1rem 0' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Project_Alpha</h4>
                        <p style={{ fontSize: '0.9rem', opacity: 0.5, margin: '0.2rem 0 0' }}>Identity & UI Motion</p>
                      </div>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <ArrowDown size={20} />
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        </section>

        {/* Professional Features Section */}
        <section style={{ padding: '8rem 4rem', background: surface }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '6rem', borderBottom: `1px solid ${primary}20`, paddingBottom: '3rem' }}>
             <div>
                <span style={{ fontWeight: 800, color: primary, letterSpacing: '0.2em', fontSize: '0.8rem' }}>CAPABILITIES</span>
                <h3 style={{ fontSize: '3.5rem', fontWeight: 900, marginTop: '1rem' }}>Engineered for <br/> <span style={{ color: primary, fontFamily: "'Amatic SC', cursive" }}>distinction.</span></h3>
             </div>
             <p style={{ maxWidth: '400px', fontSize: '1.1rem', opacity: 0.6, lineHeight: 1.6, marginBottom: '0.5rem' }}>
                Our studio operates at the intersection of technical excellence and organic human emotion.
             </p>
          </div>
          
          <div className="landing-features-layout">
            {[
              { title: 'Technical SEO', desc: 'Invisible architecture built for global discovery.', icon: Globe, color: primary },
              { title: 'Brand Identity', desc: 'Visual languages that resonate on a deeper level.', icon: Zap, color: secondary },
              { title: 'Secure Scaling', desc: 'Robust foundations that grow as fast as your dreams.', icon: Shield, color: accent }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: '1rem' }}
              >
                <div style={{ color: f.color, marginBottom: '2rem' }}>
                   <f.icon size={36} />
                </div>
                <h4 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>{f.title}</h4>
                <p style={{ opacity: 0.6, lineHeight: 1.6 }}>{f.desc}</p>
                <div style={{ marginTop: '2rem', height: '2px', width: '40px', background: f.color, opacity: 0.4 }} />
              </motion.div>
            ))}
          </div>
        </section>

        <footer style={{ padding: '8rem 4rem', background: background, borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
               <div style={{ fontWeight: 900, fontSize: '1.5rem', marginBottom: '1rem' }}>DUXEL.</div>
               <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>© 2026 Duxel Creative Studio. All Rights Reserved.</p>
            </div>
            <div style={{ display: 'flex', gap: '4rem', fontWeight: 700, fontSize: '0.9rem' }}>
               <span>Privacy</span>
               <span>Terms</span>
               <span>Twitter</span>
               <span>LinkedIn</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

