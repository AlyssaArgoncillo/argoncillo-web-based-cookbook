"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RecipeCard from './RecipeCard';
import Loader from './Loader';
import ContentWrapper from './ContentWrapper';
import { IMAGE_SIZES } from '../constants/imageSizes';

export default function Featured({ meals, loading, error }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark' || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                    html.getAttribute('data-theme') !== 'light');
    setIsDarkMode(isDark);

    const observer = new MutationObserver(() => {
      const isDark = html.getAttribute('data-theme') === 'dark' || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                      html.getAttribute('data-theme') !== 'light');
      setIsDarkMode(isDark);
    });

    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const isDark = html.getAttribute('data-theme') === 'dark' || 
                     (mediaQuery.matches && html.getAttribute('data-theme') !== 'light');
      setIsDarkMode(isDark);
    };
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <>
      <section style={{
        padding: '56px 0 80px 0',
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        backgroundColor: isDarkMode ? '#163e57' : '#fafaf8',
        backgroundImage: isDarkMode 
          ? 'linear-gradient(#163e57 1.1rem, #0f2f44 1.2rem)'
          : 'linear-gradient(#fafaf8 1.1rem, #e5e7eb 1.2rem)',
        backgroundSize: '100% 1.2rem',
        backgroundAttachment: 'local',
        transition: 'background-color 0.3s ease, background-image 0.3s ease'
      }}>
        {/* CTA Section */}
        <div style={{
          marginBottom: '64px',
          textAlign: 'center',
          maxWidth: '700px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}>
          <h1 className="animate-fade-in" style={{
            fontSize: '48px',
            fontFamily: 'var(--font-playfair-display)',
            color: 'var(--text-primary)',
            lineHeight: '1.2',
            margin: '0 0 32px 0'
          }}>
            Discover, search, and explore recipes in one platform.
          </h1>
          
          <Link href="/recipes" className="hover-lift" style={{
            display: 'inline-block',
            backgroundColor: isDarkMode ? '#f59e0b' : '#ea580c',
            color: 'white',
            padding: '12px 32px',
            borderRadius: '32px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '14px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = isDarkMode ? '#d97706' : '#c2410c'}
          onMouseLeave={(e) => e.target.style.backgroundColor = isDarkMode ? '#f59e0b' : '#ea580c'}
          >
            Browse Recipes
          </Link>
        </div>

        {/* Dashed Separator */}
        <div style={{
          height: '1px',
          borderBottom: '4px dashed rgba(193, 122, 107, 0.3)',
          margin: '48px 0 48px 0',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)'
        }} />

        {/* Editor's Picks Label */}
        <div style={{
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <span style={{
            fontSize: '16px',
            color: '#f59e0b',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            ✨ Editor's Picks ✨
          </span>
        </div>

        {/* Featured Cards Section - responsive grid */}
        <div style={{
          marginBottom: '48px',
          maxWidth: '1200px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px',
            perspective: '1000px'
          }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  minHeight: '260px',
                  border: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Loader />
                </div>
              ))
            ) : (
              meals.slice(0, 6).map((meal) => (
                <RecipeCard key={meal.idMeal} meal={meal} />
              ))
            )}
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--badge-bg)',
            color: 'var(--text-secondary)',
            padding: '12px 14px',
            borderRadius: '10px',
            marginTop: '24px',
            textAlign: 'center',
            marginLeft: '16px',
            marginRight: '16px'
          }}>
            {error}
          </div>
        )}
      </section>
    </>
  );
}
