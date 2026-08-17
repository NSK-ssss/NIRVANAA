'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';
import { GlobalStats } from '@/lib/db';
import styles from './Stats.module.css';

interface CountUpProps {
  value: number;
  duration?: number;
  isINR?: boolean;
  suffix?: string;
  prefix?: string;
}

function CountUp({ value, duration = 2.0, isINR = false, suffix = '', prefix = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(elementRef, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }

    const totalMiliseconds = duration * 1000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(totalMiliseconds / frameRate);
    let currentFrame = 0;

    const counter = setInterval(() => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const nextCount = Math.round(easeProgress * (end - start) + start);

      setCount(nextCount);

      if (currentFrame >= totalFrames) {
        setCount(end);
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [isInView, value, duration]);

  const formatDisplay = (num: number) => {
    if (isINR) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(num);
    }
    return prefix + num.toLocaleString() + suffix;
  };

  return (
    <span ref={elementRef} className={styles.counter}>
      {formatDisplay(count)}
    </span>
  );
}

interface StatsProps {
  stats: GlobalStats;
}

export default function Stats({ stats }: StatsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
    },
  };

  return (
    <section className={`section-spotlight section-spotlight-bottom ${styles.statsSection}`} id="impact">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className={styles.header}>
          <span className={styles.label}>OUR IMPACT & SCALE</span>
          <h2 className={styles.title}>
            Measurable <span className="italic-accent">performance</span>
          </h2>
        </div>

        {/* Featured Big Revenue Card */}
        <motion.div className={`${styles.featuredRevenueCard} glass-card`} variants={itemVariants}>
          <div className={styles.revenueGlowBg} />
          <div className={styles.revenueBadge}>TOTAL CLIENT VALUE DELIVERED</div>
          <div className={styles.revenueNumberRow}>
            <CountUp value={stats.totalRevenue} isINR={true} duration={2.2} />
          </div>
          <p className={styles.revenueSubtext}>
            Cumulative project value and commercial revenue generated across 10 signature digital platforms engineered by Nirvanaa Studios.
          </p>
        </motion.div>

        {/* Grid of Key Supporting Metrics */}
        <div className={styles.metricsGrid}>
          {/* Projects Completed & Shipped */}
          <motion.div className={`${styles.metricCard} glass-card`} variants={itemVariants}>
            <div className={styles.metricNumber}>
              <CountUp value={stats.completedProjects || 7} />
            </div>
            <span className={styles.metricLabel}>COMPLETED & SHIPPED</span>
            <p className={styles.metricDesc}>Live web and mobile applications running in production.</p>
          </motion.div>

          {/* Currently Working / In Progress */}
          <motion.div className={`${styles.metricCard} glass-card`} variants={itemVariants}>
            <div className={styles.metricNumber}>
              <CountUp value={stats.inProgressProjects || 2} />
            </div>
            <span className={styles.metricLabel}>CURRENTLY IN PROGRESS</span>
            <p className={styles.metricDesc}>Active developments in design, API building, and deployment.</p>
          </motion.div>

          {/* Total Projects */}
          <motion.div className={`${styles.metricCard} glass-card`} variants={itemVariants}>
            <div className={styles.metricNumber}>
              <CountUp value={stats.totalProjects || 10} />
            </div>
            <span className={styles.metricLabel}>TOTAL PROJECTS</span>
            <p className={styles.metricDesc}>Delivered across travel, tourism, car rental, and wellness brands.</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
