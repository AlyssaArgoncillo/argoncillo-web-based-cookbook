"use client";

import { useState } from 'react';
import Loader from './Loader';
import { getMealsByIngredient, getMealById } from '../services/mealdb';

export default function IngredientFinder() {
  const [ingredientQuery, setIngredientQuery] = useState('');
  const [ingredientResults, setIngredientResults] = useState([]);
  const [ingredientLoading, setIngredientLoading] = useState(false);
  const [ingredientError, setIngredientError] = useState('');

  const handleFindByIngredient = async () => {
    if (!ingredientQuery.trim()) {
      setIngredientError('Please enter an ingredient to search.');
      setIngredientResults([]);
      return;
    }
    setIngredientError('');
    setIngredientLoading(true);
    try {
      const meals = await getMealsByIngredient(ingredientQuery.trim());
      if (!meals || meals.length === 0) {
        setIngredientError('No recipes found for that ingredient.');
        setIngredientResults([]);
      } else {
        const first = meals[0];
        try {
          const full = await getMealById(first.idMeal);
          setIngredientResults([full || first]);
        } catch (err) {
          setIngredientResults([first]);
        }
      }
    } catch (err) {
      console.error('Error fetching ingredient recipes', err);
      setIngredientError('Something went wrong. Please try again.');
      setIngredientResults([]);
    } finally {
      setIngredientLoading(false);
    }
  };

  return (
    <section style={{
      padding: '40px 16px 56px',
      maxWidth: '1100px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '12px',
        padding: '40px 28px',
        border: '2px solid var(--badge-bg)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>
              🥕
            </div>
            <h3 style={{
              fontSize: '26px',
              fontFamily: 'var(--font-playfair-display)',
              color: 'var(--text-primary)',
              margin: '0 0 10px 0'
            }}>
              Pick an ingredient, get a recipe
            </h3>
            <p style={{
              fontSize: '15px',
              color: 'var(--text-secondary)',
              margin: '0 0 22px 0',
              maxWidth: '560px',
              lineHeight: '1.6'
            }}>
              Choose what you have on hand and we&apos;ll suggest a dish built around that ingredient. Quick, simple, and tasty.
            </p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'stretch', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={ingredientQuery}
                onChange={(e) => setIngredientQuery(e.target.value)}
                placeholder="e.g. chicken, tomato, cheese"
                style={{
                  flex: '1 1 240px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--badge-bg)',
                  fontSize: '15px',
                  color: 'var(--text-primary)',
                  backgroundColor: 'var(--bg-main)'
                }}
              />
              <button
                onClick={handleFindByIngredient}
                disabled={ingredientLoading}
                style={{
                  padding: '12px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--btn-primary)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '15px',
                  minWidth: '140px',
                  cursor: 'pointer',
                  opacity: ingredientLoading ? 0.8 : 1,
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--btn-primary-hover)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--btn-primary)'}
              >
                {ingredientLoading ? 'Finding...' : 'Find'}
              </button>
            </div>

            {ingredientError && (
              <p style={{
                color: 'var(--state-warning)',
                marginTop: '10px',
                marginBottom: 0,
                fontSize: '14px'
              }}>
                {ingredientError}
              </p>
            )}
          </div>

          <div style={{
            backgroundColor: 'var(--bg-main)',
            borderRadius: '12px',
            padding: '16px',
            minHeight: '220px',
            border: '1px solid var(--badge-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {ingredientLoading && <Loader />}
            {!ingredientLoading && ingredientResults.length > 0 && (
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {ingredientResults.map((result, idx) => (
                  <div
                    key={result.idMeal || idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(96px, 120px) 1fr',
                      gap: '10px',
                      alignItems: 'center',
                      backgroundColor: 'var(--bg-card)',
                      borderRadius: '10px',
                      padding: '10px',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.08)'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.12)'
                    }}>
                      <img
                        src={result.strMealThumb}
                        alt={result.strMeal}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '110px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{
                        fontSize: '17px',
                        fontWeight: 700,
                        color: 'var(--text-primary)'
                      }}>
                        {result.strMeal}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)'
                      }}>
                        {result.strArea || 'International'} • {result.strCategory || 'Recipe'}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <a
                          href={`/recipe/${result.idMeal}`}
                          style={{
                            backgroundColor: 'var(--btn-primary)',
                            color: '#fff',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontWeight: 700,
                            fontSize: '13px'
                          }}
                        >
                          View Recipe
                        </a>
                        {result.strYoutube && (
                          <a
                            href={result.strYoutube}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '10px 12px',
                              borderRadius: '8px',
                              border: '1px solid var(--badge-bg)',
                              color: 'var(--text-primary)',
                              textDecoration: 'none',
                              fontWeight: 700,
                              fontSize: '13px'
                            }}
                          >
                            Watch
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!ingredientLoading && ingredientResults.length === 0 && !ingredientError && (
              <p style={{ color: 'var(--text-secondary)', margin: 0, textAlign: 'center' }}>
                😔 No recipes found in index.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
