"use client";

import Image from 'next/image';

export default function RecipeCard({ meal }) {
  if (!meal) return null;

  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }}
    >
      {/* Recipe Image */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        backgroundColor: 'var(--text-secondary)',
        overflow: 'hidden'
      }}>
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Recipe Content */}
      <div style={{
        padding: '1rem'
      }}>
        {/* Category Badge */}
        {meal.strCategory && (
          <span style={{
            display: 'inline-block',
            backgroundColor: 'var(--badge-bg)',
            color: 'var(--badge-text)',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '0.75rem'
          }}>
            {meal.strCategory}
          </span>
        )}

        {/* Recipe Title */}
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '0.5rem',
          fontFamily: 'var(--font-playfair-display)',
          lineHeight: '1.3'
        }}>
          {meal.strMeal}
        </h3>

        {/* Recipe Area */}
        {meal.strArea && (
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            marginBottom: '0.75rem',
            fontFamily: 'var(--font-comfortaa)'
          }}>
            {meal.strArea} Cuisine
          </p>
        )}

        {/* View Recipe Button */}
        <button style={{
          width: '100%',
          backgroundColor: 'transparent',
          color: 'var(--btn-primary)',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '2px solid var(--btn-primary)',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginTop: '0.5rem'
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
          View Recipe
        </button>
      </div>
    </div>
  );
}
