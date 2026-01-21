"use client";

import { useEffect, useRef } from 'react';
import Loader from './Loader';

export default function VideoSection({ meals, loading }) {
  const videoStripRef = useRef(null);

  // Auto-scroll the featured videos strip
  useEffect(() => {
    if (!videoStripRef.current || meals.length === 0) return undefined;

    let index = 0;
    const interval = setInterval(() => {
      if (!videoStripRef.current || meals.length === 0) return;
      index = (index + 1) % meals.length;
      const child = videoStripRef.current.children[index];
      if (child) {
        videoStripRef.current.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [meals]);

  return (
    <>
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
          {loading &&
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

          {!loading && meals
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
    </>
  );
}
