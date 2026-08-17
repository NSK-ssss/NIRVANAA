'use client';

import { motion } from 'framer-motion';
import styles from './Philosophy.module.css';

export default function Philosophy() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <section className={`section-spotlight section-spotlight-left ${styles.philosophySection}`} id="about">
      <motion.div
        className={styles.contentWrapper}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
      >
        <motion.div className={styles.labelWrapper} variants={itemVariants}>
          <span className={styles.spotlightTag}>ABOUT THE STUDIO</span>
          <div className={styles.tagLine} />
        </motion.div>

        <motion.h2 className={styles.headline} variants={itemVariants}>
          NIRVANAA STUDIOS — A CREATIVE DIGITAL STUDIO BUILDING <span className="italic-accent">websites</span> THAT <span className="italic-accent">scale</span>.
        </motion.h2>

        <motion.div className={styles.quoteBlock} variants={itemVariants}>
          <p className={styles.quoteText}>
            “We help scale businesses through digital mediums.”
          </p>
        </motion.div>

        <motion.div className={styles.divider} variants={itemVariants} />

        <div className={styles.paragraphsGrid}>
          <motion.p className={styles.manifestoText} variants={itemVariants}>
            <span className={styles.highlight}>Nirvanaa Studios</span> is a creative digital studio based in <span className={styles.highlight}>Solapur</span>, specializing in high-performance web and mobile applications. We help businesses scale through digital mediums — from travel and rental platforms to hospitality and wellness brands.
          </motion.p>

          <motion.p className={styles.manifestoText} variants={itemVariants}>
            With <span className="italic-accent" style={{ fontSize: '1.4rem' }}>10+ projects delivered</span> across diverse industries, we engineer fast, functional, and growth-ready digital experiences that convert attention into lasting business value.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
