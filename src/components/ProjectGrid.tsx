'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink, IndianRupee, Globe } from 'lucide-react';
import { Project } from '@/lib/db';
import styles from './ProjectGrid.module.css';

interface ProjectCardProps {
  project: Project;
  index: number;
}

function ProjectCard({ project, index }: ProjectCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={styles.cardMotionWrapper}
    >
      <div className={`${styles.card} glass-card`}>
        {/* Cover Image */}
        <Link href={`/projects/${project.id}`} className={styles.imageLink}>
          <div className={styles.imageWrapper}>
            <img
              src={project.coverImage || '/images/projects/aether_cover.png'}
              alt={project.name}
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.imageOverlay} />
            
            <div className={styles.categoryBadge}>
              {project.category}
            </div>

            <div className={styles.hoverArrow}>
              <ArrowUpRight size={20} />
            </div>
          </div>
        </Link>

        {/* Content Body */}
        <div className={styles.content}>
          <div className={styles.titleRow}>
            <Link href={`/projects/${project.id}`} className={styles.projectNameLink}>
              <h3 className={styles.projectName}>{project.name}</h3>
            </Link>

            {project.url && (
              <a
                href={`https://${project.url}`}
                target="_blank"
                rel="noreferrer"
                className={styles.urlBadge}
                title={`Visit ${project.url}`}
              >
                <Globe size={12} className={styles.globeIcon} />
                <span>{project.url}</span>
                <ExternalLink size={12} />
              </a>
            )}
          </div>

          <p className={styles.desc}>{project.description}</p>

          {/* Financials & URL Footer */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>
                <IndianRupee size={12} className={styles.iconOrange} /> Project Investment
              </span>
              <span className={styles.statCost}>{formatINR(project.costing)}</span>
            </div>

            <div className={styles.statActions}>
              <Link href={`/projects/${project.id}`} className={styles.detailLink}>
                View Case Study <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ProjectGridProps {
  projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <section className={`section-spotlight section-spotlight-left ${styles.projectSection}`} id="projects">
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <span className={styles.label}>PORTFOLIO</span>
            <h2 className={styles.title}>
              Signature <span className="italic-accent">projects</span>
            </h2>
          </div>
          <p className={styles.headerDesc}>
            A track record of 10+ custom web and mobile applications delivered across tourism, rental systems, hospitality, and wellness.
          </p>
        </div>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
