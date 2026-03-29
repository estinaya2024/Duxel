import React from 'react';
import { motion } from 'framer-motion';
import type { FullTheme } from '../utils/palette';
import { getContrastColor } from '../utils/palette';
import { Bell, Home, Compass, Heart, User, Search, Star, ChevronRight, Wifi, Battery } from 'lucide-react';

interface MobileAppPreviewProps {
  theme: FullTheme;
  useGradient?: boolean;
}

export const MobileAppPreview: React.FC<MobileAppPreviewProps> = ({ theme, useGradient = true }) => {
  const { config } = theme;
  const { primary, secondary, accent, background, surface } = config;

  const textOnPrimary = getContrastColor(primary);
  const textOnBg = getContrastColor(background);
  const textOnSurface = getContrastColor(surface);

  const notifications = [
    { title: 'New Drop Alert 🔥', sub: 'Forest Breath palette just released', time: '2m', color: primary, read: false },
    { title: 'Palette Saved', sub: 'Your Midnight Velvet theme is ready', time: '18m', color: accent, read: false },
    { title: 'Weekly Digest', sub: '12 new community themes this week', time: '2h', color: secondary, read: true },
    { title: 'Pro Feature Unlocked', sub: 'WCAG Auditor now available', time: '1d', color: accent, read: true },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '3rem',
        background: 'var(--bg-primary)',
        borderRadius: '32px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-primary)',
        gap: '4rem',
        flexWrap: 'wrap',
      }}
    >
      {/* Phone Frame */}
      <div style={{ position: 'relative' }}>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            width: '320px',
            height: '650px',
            borderRadius: '44px',
            background: background,
            border: '8px solid #1a1a1a',
            boxShadow: '0 30px 80px rgba(0,0,0,0.3), inset 0 0 0 2px rgba(255,255,255,0.05)',
            overflow: 'hidden',
            position: 'relative',
            color: textOnBg,
            fontFamily: "'Nunito', sans-serif",
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Status Bar */}
          <div
            style={{
              padding: '12px 20px 8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: primary,
              color: textOnPrimary,
              fontSize: '0.7rem',
              fontWeight: 800,
            }}
          >
            <span>9:41</span>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <Wifi size={12} />
              <Battery size={12} />
            </div>
          </div>

          {/* Hero Header */}
          <div
            style={{
              background: useGradient
                ? `linear-gradient(160deg, ${primary}, ${secondary})`
                : primary,
              padding: '1.5rem 1.25rem 2rem',
              color: textOnPrimary,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', opacity: 0.75, fontWeight: 700 }}>Good Evening</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>Duxel Studio 🎨</div>
              </div>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bell size={18} />
              </div>
            </div>

            {/* Search Bar */}
            <div
              style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '12px',
                padding: '0.6rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Search size={14} style={{ opacity: 0.7 }} />
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Search palettes...</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              padding: '1rem 1.25rem',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '0.5rem',
              background: surface,
            }}
          >
            {[
              { label: 'Saved', value: '24', color: primary },
              { label: 'Shared', value: '8', color: accent },
              { label: 'Rating', value: '4.9★', color: secondary },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  background: background,
                  borderRadius: '12px',
                  padding: '0.75rem',
                  textAlign: 'center',
                  border: `1px solid ${stat.color}20`,
                }}
              >
                <div style={{ fontSize: '1rem', fontWeight: 900, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '0.6rem', fontWeight: 700, opacity: 0.5 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Notifications Feed */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1rem', background: background }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 900, opacity: 0.4, letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
              RECENT
            </div>
            {notifications.map((n, i) => (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: '14px',
                  marginBottom: '0.5rem',
                  background: n.read ? 'transparent' : `${n.color}08`,
                  border: `1px solid ${n.read ? 'transparent' : n.color + '20'}`,
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `${n.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Star size={16} style={{ color: n.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 900, color: textOnBg }}>{n.title}</div>
                  <div style={{ fontSize: '0.62rem', opacity: 0.5, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.sub}
                  </div>
                </div>
                <div style={{ fontSize: '0.58rem', opacity: 0.4, fontWeight: 700, flexShrink: 0 }}>{n.time}</div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Nav */}
          <div
            style={{
              background: surface,
              borderTop: '1px solid rgba(0,0,0,0.06)',
              padding: '0.75rem 0 0.5rem',
              display: 'flex',
              justifyContent: 'space-around',
              color: textOnSurface,
            }}
          >
            {[
              { icon: Home, label: 'Home', active: true },
              { icon: Compass, label: 'Explore', active: false },
              { icon: Heart, label: 'Saved', active: false },
              { icon: User, label: 'Profile', active: false },
            ].map(({ icon: Icon, label, active }, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '3px',
                  color: active ? primary : textOnSurface,
                  opacity: active ? 1 : 0.4,
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: '0.55rem', fontWeight: 800 }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Phone notch */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80px',
            height: '20px',
            borderRadius: '0 0 12px 12px',
            background: '#1a1a1a',
            zIndex: 10,
          }}
        />
      </div>

      {/* Feature Description */}
      <div style={{ maxWidth: '340px', paddingTop: '3rem' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '50px',
            background: `${primary}15`,
            color: primary,
            fontSize: '0.7rem',
            fontWeight: 900,
            letterSpacing: '0.1em',
            marginBottom: '1.5rem',
          }}
        >
          MOBILE APP UI
        </div>

        <h3 style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          How your theme looks on mobile.
        </h3>

        <p style={{ opacity: 0.6, lineHeight: 1.7, marginBottom: '2rem', fontSize: '0.95rem' }}>
          Validates your palette across status bars, bottom navigation, and card feed components — the most critical touch-points in a mobile UI.
        </p>

        {[
          'Status bar & navigation layer',
          'Notification card hierarchy',
          'Interactive element contrast',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <ChevronRight size={16} style={{ color: primary, flexShrink: 0 }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, opacity: 0.75 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
