'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isHome = pathname === '/';

  const navLinks = [
    { label: 'ABOUT', href: isHome ? '#about' : '/#about' },
    { label: 'WORK', href: isHome ? '#projects' : '/#projects' },
    { label: 'IMPACT', href: isHome ? '#impact' : '/#impact' },
    { label: 'CONTACT', href: isHome ? '#contact' : '/#contact' },
  ];

  return (
    <header className={`${styles.navbarWrapper} ${isScrolled ? styles.scrolled : ''}`}>
      <nav className={styles.navbar}>
        {/* Left: Studio Monogram Emblem & Wordmark */}
        <Link href="/" onClick={closeMenu} className={styles.logoLink}>
          <img src="/logo-white.png" alt="Nirvanaa Studios Logo" className={styles.logoEmblem} />
          <span className={styles.logoText}>NIRVANAA STUDIOS</span>
          <span className={styles.logoDot} />
        </Link>

        {/* Right Nav Links */}
        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className={styles.navLink}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile CTA */}
          <Link href={isHome ? '#contact' : '/#contact'} onClick={closeMenu} className={styles.mobileCtaWrapper}>
            <button className="btn-orange" style={{ width: '100%', fontSize: '0.85rem' }}>
              START A PROJECT
            </button>
          </Link>
        </div>

        {/* Desktop CTA Button & Mobile Toggle */}
        <div className={styles.actions}>
          <Link href={isHome ? '#contact' : '/#contact'} className={styles.desktopCta}>
            <button className="btn-orange" style={{ padding: '10px 22px', fontSize: '0.8rem' }}>
              LET'S TALK
            </button>
          </Link>

          <button
            className={styles.menuToggle}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={22} color="#ffffff" /> : <Menu size={22} color="#ffffff" />}
          </button>
        </div>
      </nav>
    </header>
  );
}
