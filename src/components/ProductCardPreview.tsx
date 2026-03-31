import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { FullTheme } from '../utils/palette';
import { getContrastColor } from '../utils/palette';
import { ShoppingCart, Heart, Star, Filter, ChevronDown, Box } from 'lucide-react';

interface ProductCardPreviewProps {
  theme: FullTheme;
  useGradient?: boolean;
}

const PRODUCTS = [
  { name: 'Studio Palette Kit',    category: 'Digital',  price: '$49',  rating: 4.9, reviews: 128, tag: 'Bestseller' },
  { name: 'Brand Identity Pack',   category: 'Template', price: '$89',  rating: 4.8, reviews: 64,  tag: 'New' },
  { name: 'Color Harmony Guide',   category: 'E-Book',   price: '$24',  rating: 5.0, reviews: 312, tag: 'Top Rated' },
  { name: 'UI Component Library',  category: 'Design',   price: '$129', rating: 4.7, reviews: 89,  tag: 'Pro' },
  { name: 'Motion Typography Set', category: 'Font',     price: '$39',  rating: 4.9, reviews: 201, tag: 'Popular' },
  { name: 'Dark Mode System',      category: 'Template', price: '$59',  rating: 4.6, reviews: 77,  tag: 'Hot' },
];

export const ProductCardPreview: React.FC<ProductCardPreviewProps> = ({ theme, useGradient = true }) => {
  const { config } = theme;
  const { primary, secondary, accent, background, surface } = config;
  const [hearts, setHearts] = useState<Set<number>>(new Set());

  const textOnPrimary = getContrastColor(primary);
  const textOnBg = getContrastColor(background);

  const toggleHeart = (i: number) => {
    setHearts(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const tagColors: Record<string, string> = {
    Bestseller: primary,
    'Top Rated': accent,
    New: secondary,
    Pro: '#8B5CF6',
    Popular: primary,
    Hot: '#ef4444',
  };

  // Gradient or solid header background
  const headerBg = useGradient
    ? `linear-gradient(120deg, ${primary}e6, ${secondary}cc)`
    : primary;

  return (
    <div
      style={{
        background,
        borderRadius: '32px',
        border: '1px solid var(--border-light)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-primary)',
        fontFamily: "'Nunito', sans-serif",
        color: textOnBg,
      }}
    >
      {/* Store Header */}
      <div
        className="product-header-flex"
        style={{
          background: headerBg,
          padding: '2.5rem 3rem',
          color: textOnPrimary,
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.75, letterSpacing: '0.15em', marginBottom: '0.4rem' }}>
            DUXEL MARKETPLACE
          </div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, margin: 0, lineHeight: 1 }}>
            Design Resources
          </h2>
          <p style={{ opacity: 0.75, margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
            {PRODUCTS.length} products · Theme preview
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '0.9rem 1.75rem',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '14px',
            color: textOnPrimary,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 800,
            fontSize: '0.9rem',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Filter size={16} />
          Filter
          <ChevronDown size={16} />
        </motion.button>
      </div>

      {/* Category Pills */}
      <div
        style={{
          padding: '1.5rem 3rem',
          display: 'flex',
          gap: '0.75rem',
          background: surface,
          borderBottom: '1px solid var(--border-light)',
          overflowX: 'auto',
        }}
      >
        {['All', 'Digital', 'Template', 'E-Book', 'Design', 'Font'].map((cat, i) => (
          <button
            key={i}
            style={{
              padding: '0.5rem 1.25rem',
              borderRadius: '50px',
              border: `1px solid ${i === 0 ? primary : 'var(--border-light)'}`,
              background: i === 0 ? primary : 'transparent',
              color: i === 0 ? textOnPrimary : getContrastColor(surface),
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              opacity: i === 0 ? 1 : 0.6,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div
        className="product-grid-layout"
        style={{
          padding: '2.5rem 3rem',
          background,
        }}
      >
        {PRODUCTS.map((product, i) => {
          const cardAccent = i % 3 === 0 ? primary : i % 3 === 1 ? secondary : accent;
          const isHearted = hearts.has(i);

          // Card hero: gradient or solid tint
          const cardHeroBg = useGradient
            ? `linear-gradient(135deg, ${cardAccent}22, ${cardAccent}44)`
            : `${cardAccent}18`;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              style={{
                background: surface,
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {/* Card Hero — color block, no emoji */}
              <div
                style={{
                  height: '130px',
                  background: cardHeroBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Box size={36} style={{ color: cardAccent, opacity: 0.4 }} />

                {/* Wishlist heart */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => toggleHeart(i)}
                  style={{
                    position: 'absolute', top: '12px', right: '12px',
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.85)', border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', backdropFilter: 'blur(4px)',
                  }}
                >
                  <Heart size={16} fill={isHearted ? '#ef4444' : 'none'} style={{ color: isHearted ? '#ef4444' : '#888' }} />
                </motion.button>

                {/* Tag badge */}
                <div
                  style={{
                    position: 'absolute', top: '12px', left: '12px',
                    padding: '3px 10px', borderRadius: '50px',
                    background: tagColors[product.tag] || primary,
                    color: getContrastColor(tagColors[product.tag] || primary),
                    fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.05em',
                  }}
                >
                  {product.tag}
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: cardAccent, letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  {product.category.toUpperCase()}
                </div>
                <div style={{ fontWeight: 900, fontSize: '0.95rem', marginBottom: '0.5rem', color: getContrastColor(surface) }}>
                  {product.name}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1rem' }}>
                  <Star size={12} fill={accent} style={{ color: accent }} />
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: accent }}>{product.rating}</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.4, fontWeight: 700 }}>({product.reviews})</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 900, color: cardAccent }}>{product.price}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: '10px',
                      background: cardAccent, color: getContrastColor(cardAccent),
                      border: 'none', display: 'flex', alignItems: 'center',
                      gap: '6px', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer',
                    }}
                  >
                    <ShoppingCart size={13} />
                    Add
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
