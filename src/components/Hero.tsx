'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // Mouse & Lerped Lens Position
  const mousePos = useRef({ x: 420, y: 240 });
  const lensPos = useRef({ x: 420, y: 240 });
  const lensRef = useRef<HTMLDivElement>(null);
  const lensInnerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // Smooth lerp animation loop
  const updateLens = useCallback(() => {
    const lerpFactor = 0.12;
    lensPos.current.x += (mousePos.current.x - lensPos.current.x) * lerpFactor;
    lensPos.current.y += (mousePos.current.y - lensPos.current.y) * lerpFactor;

    if (lensRef.current && lensInnerRef.current) {
      const lx = lensPos.current.x;
      const ly = lensPos.current.y;
      
      lensRef.current.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;

      const scale = 1.25;
      lensInnerRef.current.style.transform = `translate3d(${-lx * scale + 105}px, ${-ly * scale + 105}px, 0) scale(${scale})`;
    }

    animFrameRef.current = requestAnimationFrame(updateLens);
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    mousePos.current = { x: rect.width * 0.35, y: rect.height * 0.42 };
    lensPos.current = { x: rect.width * 0.35, y: rect.height * 0.42 };

    const handleMouseMove = (e: MouseEvent) => {
      const heroRect = hero.getBoundingClientRect();
      const x = e.clientX - heroRect.left;
      const y = e.clientY - heroRect.top;
      mousePos.current = { x, y };
      setIsHoveringHero(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const heroRect = hero.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - heroRect.left;
        const y = touch.clientY - heroRect.top;
        mousePos.current = { x, y };
        setIsHoveringHero(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHoveringHero(false);
    };

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('touchmove', handleTouchMove, { passive: true });
    hero.addEventListener('mouseleave', handleMouseLeave);

    animFrameRef.current = requestAnimationFrame(updateLens);

    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('touchmove', handleTouchMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [updateLens]);

  // Headline markup: "Websites that scale." / "Creative digital studio"
  const renderHeadline = (isLensLayer = false) => (
    <div className={`${styles.headlineWrapper} ${isLensLayer ? styles.lensHeadlineWrapper : ''}`}>
      <div className={styles.headlineTopBadge}>
        <span className={styles.subtextStudio}>NIRVANAA STUDIOS • CREATIVE DIGITAL STUDIO</span>
      </div>

      {/* Line 1: "Websites" + inline "that" in orange italic */}
      <div className={styles.headlineLine1}>
        <span className={styles.headlineBold}>Websites</span>
        <span className={styles.headlineItalicAccent}>that</span>
      </div>

      {/* Line 2: "scale." */}
      <div className={styles.headlineLine2}>
        <span className={styles.headlineBold}>scale.</span>
      </div>
    </div>
  );

  const handleScrollToWork = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.heroSection} ref={heroRef} id="hero">
      {/* Atmospheric Top-Right Blue Glow Spotlight */}
      <div className={styles.spotlightGlow} aria-hidden="true" />
      <div className={styles.spotlightSecondaryGlow} aria-hidden="true" />

      {/* Hero Center Content Container */}
      <div className={styles.heroContainer}>
        {/* Main Base Headline Layer */}
        <div className={styles.headlineContainer} ref={headlineRef}>
          {renderHeadline(false)}
        </div>

        {/* Cursor-Following Magnifying Glass Lens */}
        <div
          ref={lensRef}
          className={`${styles.lensOrb} ${isHoveringHero ? styles.lensActive : ''}`}
          aria-hidden="true"
        >
          {/* Glass Rim & Specular Shimmer Highlights */}
          <div className={styles.lensGlassRim} />
          <div className={styles.lensGlassReflection} />
          <div className={styles.lensHologramGrid} />

          {/* Scaled & Chromatic Aberration Text Layer */}
          <div ref={lensInnerRef} className={styles.lensContentLayer}>
            <div className={styles.lensAberrationCyan}>
              {renderHeadline(true)}
            </div>
            <div className={styles.lensAberrationRed}>
              {renderHeadline(true)}
            </div>
            <div className={styles.lensAberrationBase}>
              {renderHeadline(true)}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Meta & Navigation Area */}
      <div className={styles.heroBottom}>
        {/* Bottom-Left Meta Info Blocks */}
        <div className={styles.metaInfoRow}>
          <div className={styles.metaBlock}>
            <span className={styles.metaKey}>SERVICES</span>
            <span className={styles.metaVal}>WEB AND MOBILE APPLICATIONS</span>
          </div>

          <div className={styles.metaBlock}>
            <span className={styles.metaKey}>LOCATION</span>
            <span className={styles.metaVal}>SOLAPUR</span>
          </div>
        </div>

        {/* Bottom-Right Scroll Down Element */}
        <div className={styles.bottomRightArea}>
          <button
            className={styles.exploreBtn}
            onClick={handleScrollToWork}
            aria-label="Explore Selected Projects"
          >
            <span className={styles.exploreText}>EXPLORE WORK</span>
            <div className={styles.arrowCircle}>
              <ArrowDown size={16} />
            </div>
          </button>

          {/* Thin Horizontal Progress Indicator */}
          <div className={styles.progressTrack} onClick={handleScrollToWork} title="Scroll to work">
            <div className={styles.progressBar} />
          </div>

          {/* Slim Vertical Divider Line */}
          <div className={styles.verticalDivider} />
        </div>
      </div>
    </section>
  );
}
