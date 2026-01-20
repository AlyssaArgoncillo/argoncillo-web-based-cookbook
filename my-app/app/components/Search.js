"use client";

import { useState } from 'react';

export default function Search({ placeholder = "Search recipes...", onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      width: '100%',
      maxWidth: '100%',
      margin: '1rem 0'
    }}>
      <div style={{
        position: 'relative',
        width: '100%'
      }}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '12px 44px 12px 14px',
            fontSize: '16px',
            border: '2px solid var(--text-secondary)',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.3s ease',
            fontFamily: 'var(--font-comfortaa)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--btn-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--text-secondary)'}
        />
        <button
          type="submit"
          style={{
            position: 'absolute',
            right: '6px',
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-secondary)'
          }}
          onMouseOver={(e) => e.target.style.color = 'var(--btn-primary)'}
          onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </button>
      </div>
    </form>
  );
}
