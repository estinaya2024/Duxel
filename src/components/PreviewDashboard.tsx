import React from 'react';
import type { FullTheme } from '../utils/palette';
import { getContrastColor } from '../utils/palette';
import { 
  Heart, Coffee, Music, Search, 
  Wind, Sun, Users, PenTool, Layout, Settings
} from 'lucide-react';

interface PreviewDashboardProps {
  theme: FullTheme;
  useGradient?: boolean;
}

export const PreviewDashboard: React.FC<PreviewDashboardProps> = ({ theme, useGradient = true }) => {
  const { config } = theme;
  const { primary, secondary, accent, background, surface } = config;
  
  const textOnPrimary = getContrastColor(primary);
  const textOnSurface = getContrastColor(surface);

  return (
    <div className="preview-dashboard-layout" style={{ 
      background: surface, 
      color: textOnSurface, 
      minHeight: '800px',
      position: 'relative',
      padding: '0',
      fontFamily: "'Nunito', sans-serif",
      borderRadius: '32px',
      overflow: 'hidden',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-primary)'
    }}>
      {/* Professional Sidebar */}
      <aside style={{ 
        background: background, 
        borderRight: '1px solid var(--border-subtle)', 
        padding: '3rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem'
      }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: 900, fontSize: '1.25rem' }}>
            <div style={{ width: '32px', height: '32px', background: primary, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textOnPrimary }}>
               <Layout size={18} />
            </div>
            <span>Duxel<span style={{ opacity: 0.5 }}>Hub</span></span>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.4, letterSpacing: '0.1em', marginBottom: '0.5rem' }}>WORKSPACE</span>
            {[
              { label: 'Overview', icon: Layout, active: true },
              { label: 'Archives', icon: Wind, active: false },
              { label: 'Collective', icon: Users, active: false },
              { label: 'Settings', icon: Settings, active: false },
            ].map((item, i) => (
              <div key={i} style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', 
                borderRadius: '12px', background: item.active ? `${primary}15` : 'transparent',
                color: item.active ? primary : textOnSurface, fontWeight: item.active ? 800 : 500,
                cursor: 'pointer'
              }}>
                <item.icon size={18} />
                {item.label}
              </div>
            ))}
         </div>

         <div style={{ marginTop: 'auto', padding: '1.5rem', background: `${secondary}20`, borderRadius: '20px', border: `1px solid ${secondary}40` }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.4, opacity: 0.8 }}>
               Your "Journaling" streak is at 12 days! Keep it up.
            </p>
         </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ padding: '3rem 4rem', overflowY: 'auto' }}>
        <header className="product-header-flex" style={{ marginBottom: '4rem' }}>
           <h2 style={{ fontSize: '2.25rem', fontWeight: 900, margin: 0 }}>Collective Feed</h2>
           <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ padding: '0.6rem 1.25rem', background: background, borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem', width: '300px' }}>
                 <Search size={18} style={{ opacity: 0.3 }} />
                 <input type="text" placeholder="Search experiences..." style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem', outline: 'none' }} />
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: primary, color: textOnPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                 <PenTool size={20} />
              </div>
           </div>
        </header>

        <div className="preview-dashboard-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
             {/* Featured Stat Cards */}
             <div className="preview-dashboard-stats">
                <div style={{ padding: '2rem', background: background, borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ width: '40px', height: '40px', background: `${primary}15`, color: primary, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Users size={20} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981' }}>+12%</span>
                   </div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>4,281</div>
                   <div style={{ fontSize: '0.9rem', opacity: 0.5, fontWeight: 700 }}>Active Contributors</div>
                </div>
                <div style={{ padding: '2rem', background: background, borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <div style={{ width: '40px', height: '40px', background: `${secondary}15`, color: secondary, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <Sun size={20} />
                      </div>
                   </div>
                   <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>98%</div>
                   <div style={{ fontSize: '0.9rem', opacity: 0.5, fontWeight: 700 }}>Positive Sentiment</div>
                </div>
             </div>

             {/* Main Featured Card */}
             <div style={{ 
               background: useGradient
                 ? `linear-gradient(135deg, ${primary}, ${secondary})`
                 : primary, 
               padding: '3rem', 
               borderRadius: '32px',
               color: textOnPrimary,
               position: 'relative',
               overflow: 'hidden'
             }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                   <h3 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem' }}>The Duxel Grove <br/> Summer Ritual.</h3>
                   <p style={{ opacity: 0.8, maxWidth: '400px', marginBottom: '2.5rem', lineHeight: 1.5 }}>
                      Join our annual gathering of builders and dreamers in the virtual forest. Early access open now.
                   </p>
                   <button style={{ 
                      padding: '1rem 2rem', background: 'white', color: primary, 
                      borderRadius: '12px', border: 'none', fontWeight: 800, fontSize: '0.95rem'
                   }}>
                      Claim Spot
                   </button>
                </div>
                <Wind size={200} style={{ position: 'absolute', bottom: '-50px', right: '-50px', opacity: 0.1 }} />
             </div>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
             <h4 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Latest Drops</h4>
             {[
               { title: 'Morning Dew', date: '2h ago', icon: Coffee, color: primary },
               { title: 'Night Code', date: '5h ago', icon: Music, color: secondary },
               { title: 'Forest Breath', date: '1d ago', icon: Wind, color: accent },
             ].map((drop, i) => (
               <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '56px', height: '56px', background: background, borderRadius: '16px', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: drop.color }}>
                     <drop.icon size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{drop.title}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.4 }}>{drop.date}</div>
                  </div>
                  <Heart size={16} style={{ marginLeft: 'auto', opacity: 0.3 }} />
               </div>
             ))}

             <div style={{ 
               marginTop: 'auto', 
               padding: '2rem', 
               background: background, 
               borderRadius: '24px', 
               border: '1px dashed var(--border-light)',
               textAlign: 'center'
             }}>
                <PenTool size={24} style={{ color: primary, marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.6, fontStyle: 'italic', lineHeight: 1.5 }}>
                   "Creativity is the highest form of human rebellion."
                </p>
             </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

