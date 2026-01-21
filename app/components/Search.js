"use client";

import { useState } from 'react';
import { MEAL_CATEGORIES, MEAL_AREAS, MEAL_INGREDIENTS } from '../services/mealdb';

export default function Search({ placeholder = "Search recipes...", onSearch, onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [ingredient, setIngredient] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Apply search with current filters
    if (onFilterChange) {
      onFilterChange({ category, area, ingredient });
    }
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Apply search with current filters
    if (onFilterChange) {
      onFilterChange({ category, area, ingredient });
    }
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    if (onFilterChange) {
      onFilterChange({ category: value, area, ingredient });
    }
  };

  const handleAreaChange = (e) => {
    const value = e.target.value;
    setArea(value);
    if (onFilterChange) {
      onFilterChange({ category, area: value, ingredient });
    }
  };

  const handleIngredientChange = (e) => {
    const value = e.target.value;
    setIngredient(value);
    if (onFilterChange) {
      onFilterChange({ category, area, ingredient: value });
    }
  };

  const clearFilters = () => {
    setCategory('');
    setArea('');
    setIngredient('');
    setSearchTerm('');
    setShowFilters(false);
    if (onFilterChange) {
      onFilterChange({ category: '', area: '', ingredient: '' });
    }
  };

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: '100%',
        margin: '1rem 0',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          flex: 1
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

        {/* Filter Icon Button */}
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '12px 16px',
            backgroundColor: showFilters ? 'var(--btn-primary)' : 'var(--bg-card)',
            color: showFilters ? '#ffffff' : 'var(--text-primary)',
            border: '2px solid ' + (showFilters ? 'var(--btn-primary)' : 'var(--text-secondary)'),
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'var(--font-comfortaa)',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseOver={(e) => {
            if (!showFilters) {
              e.target.style.borderColor = 'var(--btn-primary)';
            }
          }}
          onMouseOut={(e) => {
            if (!showFilters) {
              e.target.style.borderColor = 'var(--text-secondary)';
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filters
          {(category || area || ingredient) && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              backgroundColor: 'var(--btn-primary)',
              color: '#ffffff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: '700'
            }}>
              {[category, area, ingredient].filter(Boolean).length}
            </span>
          )}
        </button>
      </form>

      {/* Filters Dropdown */}
      {showFilters && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          backgroundColor: 'var(--bg-card)',
          border: '2px solid var(--text-secondary)',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          minWidth: '300px',
          maxWidth: '90vw'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                fontFamily: 'var(--font-comfortaa)'
              }}>
                Category
              </label>
              <select
                value={category}
                onChange={handleCategoryChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '2px solid var(--text-secondary)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-comfortaa)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--btn-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--text-secondary)'}
              >
                <option value="">All Categories</option>
                {MEAL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                fontFamily: 'var(--font-comfortaa)'
              }}>
                Cuisine
              </label>
              <select
                value={area}
                onChange={handleAreaChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '2px solid var(--text-secondary)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-comfortaa)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--btn-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--text-secondary)'}
              >
                <option value="">All Cuisines</option>
                {MEAL_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '6px',
                fontFamily: 'var(--font-comfortaa)'
              }}>
                Main Ingredient
              </label>
              <select
                value={ingredient}
                onChange={handleIngredientChange}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  fontSize: '14px',
                  border: '2px solid var(--text-secondary)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-comfortaa)',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--btn-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--text-secondary)'}
              >
                <option value="">All Ingredients</option>
                {MEAL_INGREDIENTS.map((ing) => (
                  <option key={ing} value={ing}>{ing}</option>
                ))}
              </select>
            </div>

            {(category || area || ingredient) && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  color: 'var(--btn-primary)',
                  border: '2px solid var(--btn-primary)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-comfortaa)',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  marginTop: '4px'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'var(--btn-primary)';
                  e.target.style.color = '#ffffff';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--btn-primary)';
                }}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
