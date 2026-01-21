"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { IMAGE_SIZES } from '../constants/imageSizes';

export default function RecipeCard({ meal }) {
  const router = useRouter();
  if (!meal) return null;

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is active
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark' || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                    html.getAttribute('data-theme') !== 'light');
    setIsDarkMode(isDark);

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      const isDark = html.getAttribute('data-theme') === 'dark' || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches && 
                      html.getAttribute('data-theme') !== 'light');
      setIsDarkMode(isDark);
    });

    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    
    // Also listen to media query changes
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

  // Define colors based on theme
  const colors = isDarkMode ? {
    bg: '#fef3c7',
    imageBg: '#fde68a',
    categoryBg: '#fbbf24',
    categoryText: '#78350f',
    areaBg: '#f59e0b',
    areaText: '#ffffff',
    tagBg: '#fed7aa',
    tagText: '#92400e',
    titleText: '#78350f',
    buttonBg: '#f59e0b',
    buttonHover: '#d97706'
  } : {
    bg: '#fed7aa',
    imageBg: '#fdba74',
    categoryBg: '#fb923c',
    categoryText: '#7c2d12',
    areaBg: '#ea580c',
    areaText: '#ffffff',
    tagBg: '#fee2c3',
    tagText: '#7c2d12',
    titleText: '#7c2d12',
    buttonBg: '#ea580c',
    buttonHover: '#c2410c'
  };

  // Random slight rotation for sticky note effect
  const rotation = useMemo(() => Math.random() * 4 - 2, []); // -2 to +2 degrees

  return (
    <div style={{
      backgroundColor: colors.bg,
      borderRadius: '2px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      transform: `rotate(${rotation}deg)`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      position: 'relative',
      border: '1px solid rgba(217, 119, 6, 0.1)',
      animation: 'fadeIn 0.6s ease-out forwards'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'rotate(0deg) translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15), 0 6px 12px rgba(0,0,0,0.1)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = `rotate(${rotation}deg)`;
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)';
    }}
    >
      {/* Recipe Image */}
      <div style={{
        position: 'relative',
        width: 'calc(100% - 24px)',
        height: `${IMAGE_SIZES.RECIPE_CARD.height}px`,
        backgroundColor: colors.imageBg,
        overflow: 'hidden',
        borderBottom: '1px dashed rgba(217, 119, 6, 0.2)',
        margin: '12px 12px 0 12px'
      }}>
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: '0.9'
          }}
        />
      </div>

      {/* Recipe Content */}
      <div style={{
        padding: '1rem 1.25rem 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        {/* Multiple Tags */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '0.75rem'
        }}>
          {/* Category Tag */}
          {meal.strCategory && (
            <span style={{
              display: 'inline-block',
              backgroundColor: colors.categoryBg,
              color: colors.categoryText,
              padding: '4px 10px',
              borderRadius: '2px',
              fontSize: '11px',
              fontWeight: '700',
              flexShrink: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {meal.strCategory}
            </span>
          )}
          
          {/* Area Tag */}
          {meal.strArea && (
            <span style={{
              display: 'inline-block',
              backgroundColor: colors.areaBg,
              color: colors.areaText,
              padding: '4px 10px',
              borderRadius: '2px',
              fontSize: '11px',
              fontWeight: '700',
              flexShrink: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {meal.strArea}
            </span>
          )}
          
          {/* Additional Tags from API */}
          {meal.strTags && meal.strTags.split(',').slice(0, 2).map((tag, index) => (
            <span key={index} style={{
              display: 'inline-block',
              backgroundColor: colors.tagBg,
              color: colors.tagText,
              padding: '4px 10px',
              borderRadius: '2px',
              fontSize: '11px',
              fontWeight: '700',
              flexShrink: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {tag.trim()}
            </span>
          ))}
        </div>

        {/* Recipe Title */}
        <h3 style={{
          fontSize: '19px',
          fontWeight: '700',
          color: colors.titleText,
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-playfair-display)',
          lineHeight: '1.3',
          textShadow: '0 1px 1px rgba(255,255,255,0.5)'
        }}>
          {meal.strMeal}
        </h3>

        {/* View Recipe Button */}
        <button
          onClick={() => router.push(`/recipe/${meal.idMeal}`)}
          style={{
            width: '100%',
            backgroundColor: colors.buttonBg,
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: '2px',
            border: 'none',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginTop: 'auto',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = colors.buttonHover;
            e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = colors.buttonBg;
            e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          View Recipe
        </button>
      </div>
    </div>
  );
}
