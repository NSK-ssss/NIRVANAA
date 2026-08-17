'use client';

import { motion } from 'framer-motion';
import styles from './Timeline.module.css';

interface TimelineItemProps {
  year: string;
  title: string;
  desc: string;
  index: number;
}

function TimelineItem({ year, title, desc, index }: TimelineItemProps) {
  const isEven = index % 2 === 0;

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      x: isEven ? -30 : 30,
      y: 20
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as any
      }
    }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        delay: 0.2,
        type: 'spring' as any,
        stiffness: 150,
        damping: 15
      }
    }
  };

  return (
    <div className={`${styles.timelineItem} ${isEven ? styles.left : styles.right}`}>
      {/* Central Glowing Dot */}
      <motion.div 
        className={styles.timelineDot}
        variants={dotVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      />
      
      {/* Timeline Card */}
      <motion.div 
        className={`${styles.timelineCard} glass-card`}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        <span className={styles.timelineYear}>{year}</span>
        <h3 className={styles.timelineTitle}>{title}</h3>
        <p className={styles.timelineDesc}>{desc}</p>
      </motion.div>
    </div>
  );
}

export default function Timeline() {
  const milestones = [
    {
      year: '2020',
      title: 'The Spark',
      desc: 'Nirvanaa Studios is founded as an independent digital design atelier, driven by a radical belief that web interfaces should feel like cinematic masterworks.'
    },
    {
      year: '2022',
      title: 'Creative Engineering Lab',
      desc: 'Expanded into interactive WebGL, 3D configurators, and kinetic typography systems, earning multiple international design awards and critical acclaim.'
    },
    {
      year: '2024',
      title: 'Global Footprint',
      desc: 'Partnered with visionary brands in London, Milan, Tokyo, and New York to build revenue-driving digital ecosystems and luxury brand identities.'
    },
    {
      year: '2026',
      title: 'Hyper-Sensory Era',
      desc: 'Pioneering sensory web experiences, real-time spatial 3D shaders, and high-conversion aesthetic engines from our Tokyo and New York studios.'
    }
  ];

  return (
    <section className={`section-spotlight ${styles.timelineSection}`} id="journey">
      <div className={styles.titleContainer}>
        <span className={styles.label}>EVOLUTION</span>
        <h2 className={styles.title}>Our <span className="italic-accent">journey</span></h2>
      </div>

      <div className={styles.timelineContainer}>
        <div className={styles.timelineCenterLine} />
        {milestones.map((item, index) => (
          <TimelineItem 
            key={item.year}
            year={item.year}
            title={item.title}
            desc={item.desc}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
