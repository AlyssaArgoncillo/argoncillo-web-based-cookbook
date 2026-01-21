"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { IMAGE_SIZES } from '../constants/imageSizes';

export default function Hero() {
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
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');    const handleChange = () => {
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
    <section style={{
      background: isDarkMode 
        ? 'linear-gradient(180deg, #163e57 0%, #eea81d8d 100%)'
        : 'linear-gradient(180deg, #fdfaf6 0%, #e7632bd0 100%)',
      padding: '40px 0',
      width: '100vw',
      marginLeft: 'calc(-50vw + 50%)',
      transition: 'background 0.3s ease'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '48px 32px',
        textAlign: 'center',
        border: '2px solid var(--badge-bg)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <div style={{ maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto' }}>
          <h1 style={{
            fontSize: '3.5rem',
            marginBottom: '1rem',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-playfair-display)',
            fontWeight: 'bold',
            lineHeight: '1.1'
          }}>
            Looking for Recipes?
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            margin: '0 0 24px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            Introducing your cozy, accessible index of dishes from around the world
          </p>
        </div>

        {/* Dishly Logo */}
        <div style={{
          marginTop: '1rem',
          marginBottom: '0'
        }}>
          <Image
            src={isDarkMode ? "/Dishly_Dark_TextLogo.png" : "/Dishly_Light_TextLogo.png"}
            alt="Dishly Logo"
            width={IMAGE_SIZES.LOGO.width}
            height={IMAGE_SIZES.LOGO.height}
            priority
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
          />
        </div>
      </div>
    </section>
  );
}
