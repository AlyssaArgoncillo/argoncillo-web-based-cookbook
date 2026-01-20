"use client";

import { useEffect, useState, useRef } from 'react';
import Navigation from './components/Navigation';
import RecipeCard from './components/RecipeCard';
import ContentWrapper from './components/ContentWrapper';
import Loader from './components/Loader';
import Footer from './components/Footer';
import { getFeaturedEvenMeals, getMealsByIngredient, getMealById } from './services/mealdb';

export default function Home() {
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState('');
  const videoStripRef = useRef(null);
  const [ingredientQuery, setIngredientQuery] = useState('');
  const [ingredientResults, setIngredientResults] = useState([]);
  const [ingredientLoading, setIngredientLoading] = useState(false);
  const [ingredientError, setIngredientError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadFeatured() {
      try {
        const meals = await getFeaturedEvenMeals();
        if (isMounted) setFeaturedMeals(meals);
      } catch (error) {
        console.error('Error loading featured meals', error);
        if (isMounted) setFeaturedError('Unable to load featured recipes right now.');
      } finally {
        if (isMounted) setLoadingFeatured(false);
      }
    }

    loadFeatured();
    return () => { isMounted = false; };
  }, []);

  // Auto-scroll the featured videos strip
  useEffect(() => {
    if (!videoStripRef.current || featuredMeals.length === 0) return undefined;

    let index = 0;
    const interval = setInterval(() => {
      if (!videoStripRef.current || featuredMeals.length === 0) return;
      index = (index + 1) % featuredMeals.length;
      const child = videoStripRef.current.children[index];
      if (child) {
        videoStripRef.current.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [featuredMeals]);

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
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Navigation />

      {/* Hero Section */}
      <section className="hero-section" style={{ paddingTop: '32px' }}>
        <ContentWrapper
          className="container"
          maxWidth="960px"
          padding="56px 16px"
          backgroundColor="transparent"
          minHeight="auto"
          style={{
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(0,0,0,0.12)'
          }}
        >
          <h1 style={{
            fontSize: '32px',
            marginBottom: '1.25rem',
            color: '#1f2937'
          }}>
            Welcome to Dishly!
          </h1>
          <p style={{
            fontSize: '18px',
            maxWidth: '640px',
            margin: '0 auto 1.75rem',
            color: '#374151',
            lineHeight: '1.7'
          }}>
            Your cozy, accessible index of dishes from around the world — discover, browse, and explore recipes in one platform. Your personal cookbook awaits.
          </p>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '320px',
            margin: '0 auto'
          }}>
            <button style={{
              backgroundColor: 'var(--btn-primary)',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--btn-primary-hover)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--btn-primary)'}
            >
              Explore Recipes
            </button>
          </div>
        </ContentWrapper>
      </section>

      {/* Featured Section */}
      <section style={{
        padding: '24px 16px 56px',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
          marginBottom: '1.25rem'
        }}>
          <div>
            <p style={{
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Editor&apos;s picks
            </p>
            <h2 style={{
              fontSize: '26px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-playfair-display)',
              margin: 0
            }}>
              Featured Recipes
            </h2>
          </div>
        </div>

        {featuredError && (
          <div style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--badge-bg)',
            color: 'var(--text-secondary)',
            padding: '12px 14px',
            borderRadius: '10px'
          }}>
            {featuredError}
          </div>
        )}

        {!featuredError && (
          <div
            className="featured-recipes"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}
          >
            {loadingFeatured ? (
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
              featuredMeals.map((meal) => (
                <RecipeCard key={meal.idMeal} meal={meal} />
              ))
            )}
          </div>
        )}
      </section>

      {/* Video Section CTA */}
      <section style={{
        padding: '40px 16px',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '12px',
          padding: '48px 32px',
          textAlign: 'center',
          border: '2px solid var(--badge-bg)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            fontSize: '40px',
            marginBottom: '16px'
          }}>
            🎬
          </div>
          <h3 style={{
            fontSize: '28px',
            fontFamily: 'var(--font-playfair-display)',
            color: 'var(--text-primary)',
            margin: '0 0 12px 0'
          }}>
            Watch Recipe Videos
          </h3>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            margin: '0 0 24px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6'
          }}>
            Learn step-by-step cooking techniques and tips from experienced cooks and fellow learners. Each featured recipe includes a link to instructional videos.
          </p>
        </div>
      </section>

      {/* Featured Video Selection - auto scrolling */}
      <section style={{
        padding: '12px 16px 48px',
        maxWidth: '1100px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: '12px',
          marginBottom: '1rem'
        }}>
          <div>
            <p style={{
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              Featured videos
            </p>
            <h2 style={{
              fontSize: '24px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-playfair-display)',
              margin: 0
            }}>
              Watch & cook along
            </h2>
          </div>
        </div>

        <div
          ref={videoStripRef}
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: '340px',
            gap: '16px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollSnapType: 'x mandatory'
          }}
        >
          {loadingFeatured &&
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} style={{
                backgroundColor: 'transparent',
                borderRadius: '12px',
                padding: '1rem',
                minHeight: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scrollSnapAlign: 'start'
              }}>
                <Loader />
              </div>
            ))}

          {!loadingFeatured && featuredMeals
            .filter((meal) => meal?.strYoutube)
            .map((meal) => (
              <a
                key={meal.idMeal}
                href={meal.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  scrollSnapAlign: 'start',
                  textDecoration: 'none'
                }}
              >
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.6))',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <span style={{
                    backgroundColor: 'rgba(0,0,0,0.55)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '68px',
                    height: '68px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px'
                  }}>
                    ►
                  </span>
                  <div style={{
                    color: '#fff',
                    textAlign: 'center',
                    padding: '0 16px',
                    fontWeight: 700,
                    lineHeight: 1.35,
                    fontSize: '16px'
                  }}>
                    {meal.strMeal}
                  </div>
                </div>
              </a>
            ))}
        </div>
      </section>

      {/* Ingredient-based CTA */}
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

      <Footer />
    </div>
  );
}
