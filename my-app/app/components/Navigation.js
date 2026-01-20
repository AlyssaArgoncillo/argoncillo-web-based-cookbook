"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Search from './Search';

export default function Navigation() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);

  const logoSrc = theme === "dark"
    ? "/Dishly_Dark_TextLogo.png"
    : "/Dishly_Light_TextLogo.png";

  const applyTheme = (value) => {
    const next = value === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(stored || (prefersDark ? "dark" : "light"));
  }, []);

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    // Add search logic here
  };

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--text-secondary)',
        padding: '0.75rem 1rem',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <div className="navbar-inner" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Logo/Brand */}
        <div className="navbar-brand" style={{
          textAlign: 'center',
          padding: '0',
          minHeight: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: 0, margin: 0 }}>
            <Image
              key={theme}
              src={logoSrc}
              alt="Dishly Logo"
              width={200}
              height={56}
              priority
              style={{ height: 'auto', width: 'auto', maxHeight: '56px', maxWidth: '50vw', objectFit: 'contain' }}
            />
          </a>
        </div>

        {/* Search Bar */}
        <div className="navbar-search" style={{
          width: '100%'
        }}>
          <Search placeholder="Search recipes..." onSearch={handleSearch} />
        </div>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span aria-hidden="true">☰</span>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Menu</span>
        </button>

        {/* Navigation Links */}
        <ul
          className={`navbar-links ${menuOpen ? 'is-open' : ''}`}
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}
        >
          <li>
            <a href="/" style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--btn-primary)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-primary)'}
            >
              Home
            </a>
          </li>
          <li>
            <a href="/recipes" style={{
              color: 'var(--text-primary)',
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.color = 'var(--btn-primary)'}
            onMouseOut={(e) => e.target.style.color = 'var(--text-primary)'}
            >
              Recipes
            </a>
          </li>
          <li>
            <button
              type="button"
              className="theme-toggle"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
            >
              <span className="theme-toggle-icon" aria-hidden="true">
                {theme === "dark" ? "🌙" : "☀️"}
              </span>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
