"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Footer() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark' || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                      html.getAttribute('data-theme') !== 'light');
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, []);

  const logoSrc = isDarkMode ? '/Dishly_Light_TextLogo.png' : '/Dishly_Dark_TextLogo.png';
  const bgColor = isDarkMode ? '#fdf4e3' : '#0f2f44';
  const textColor = isDarkMode ? '#1a1a2e' : '#ffffff';
  const borderColor = isDarkMode ? '#1a1a2e' : '#ffffff';

  return (
    <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t-4" style={{ backgroundColor: bgColor, borderColor: borderColor }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-6 md:gap-0">
          {/* Left: Logo & Branding */}
          <div className="flex-1 w-full md:w-auto text-center md:text-left">
            <div className="mb-3 flex justify-center md:justify-start">
              <Image
                src={logoSrc}
                alt="Dishly Logo"
                width={200}
                height={60}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
            <p className="text-sm mb-1" style={{ color: textColor }}>A beta website acting as a personal cookbook</p>
          </div>

          {/* Right: Contact & Socials */}
          <div className="flex-1 w-full md:w-auto text-center md:text-right">
            <h3 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: textColor }}>Connect with Me!</h3>
            <a href="mailto:alyssaargoncillo@gmail.com" className="text-sm block hover:underline" style={{ color: textColor }}>
              alyssaargoncillo@gmail.com
            </a>
            <a href="mailto:anargoncillo@mcm.edu.ph" className="text-sm block hover:underline" style={{ color: textColor }}>
              anargoncillo@mcm.edu.ph
            </a>

            <div className="flex items-center justify-center md:justify-end gap-3 sm:gap-4 mt-4">
              {/* GitHub */}
              <a href="https://github.com/AlyssaArgoncillo" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:opacity-70 transition" style={{ color: textColor }}>
                <svg viewBox="0 0 24 24" width="36" height="36" className="sm:w-10 sm:h-10" fill="currentColor" aria-hidden="true">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com/ekleas.prsea" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-70 transition" style={{ color: textColor }}>
                <svg viewBox="0 0 24 24" width="36" height="36" className="sm:w-10 sm:h-10" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Discord */}
              <div className="relative group">
                <button className="hover:opacity-70 transition" aria-label="Discord" style={{ color: textColor }}>
                  <svg viewBox="0 0 24 24" width="40" height="40" className="sm:w-11 sm:h-11" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </button>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs rounded px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow">
                  Add me on Discord: <span className="font-semibold">ekleas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 sm:mt-8 pt-6 border-t" style={{ borderColor: textColor, borderOpacity: 0.2 }}>
        <p className="m-0 text-xs" style={{ color: textColor, opacity: 0.8 }}>
          © 2026 Dishly. All rights reserved. | Powered by TheMealDB
        </p>
      </div>
    </footer>
  );
}
