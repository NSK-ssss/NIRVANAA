'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { TwitterIcon, LinkedinIcon, DribbbleIcon } from './SocialIcons';
import { TeamMember } from '@/lib/db';
import styles from './TeamGrid.module.css';

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

function TeamCard({ member, index }: TeamCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    const rotateX = mouseY * -10;
    const rotateY = mouseX * 10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1] as any,
      },
    },
  };

  return (
    <motion.div
      className={styles.cardContainer}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      <div
        ref={cardRef}
        className={`${styles.card} glass-card`}
        style={{
          ...tiltStyle,
          transition: 'transform 0.15s ease-out, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Card Header & Founder Info */}
        <div className={styles.info}>
          <div className={styles.topBadgeRow}>
            <div className={styles.monogram}>
              {member.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <span className={styles.founderTag}>
              {member.role.toLowerCase().includes('co-founder') ? 'CO-FOUNDER' : 'FOUNDER'}
            </span>
          </div>

          <div className={styles.nameRow}>
            <h3 className={styles.name}>{member.name}</h3>
            <span className={styles.role}>{member.role}</span>
          </div>

          <p className={styles.bio}>{member.bio}</p>

          <span className={styles.skillsTitle}>CORE EXPERTISE</span>
          <div className={styles.skillsContainer}>
            {member.skills.map((skill) => (
              <span key={skill} className={styles.skillBadge}>
                {skill}
              </span>
            ))}
          </div>

          {/* Social Links with Orange Accents */}
          <div className={styles.socials}>
            {member.socials.linkedin && (
              <a
                href={member.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label={`${member.name} LinkedIn`}
              >
                <LinkedinIcon size={16} />
              </a>
            )}
            {member.socials.twitter && (
              <a
                href={member.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label={`${member.name} Twitter`}
              >
                <TwitterIcon size={16} />
              </a>
            )}
            {member.socials.dribbble && (
              <a
                href={member.socials.dribbble}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label={`${member.name} Dribbble`}
              >
                <DribbbleIcon size={16} />
              </a>
            )}
            {!member.socials.twitter && !member.socials.linkedin && !member.socials.dribbble && (
              <span className={styles.socialLink} style={{ opacity: 0.6 }}>
                <Globe size={16} />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface TeamGridProps {
  team: TeamMember[];
}

export default function TeamGrid({ team }: TeamGridProps) {
  return (
    <section className={`section-spotlight section-spotlight-left ${styles.teamSection}`} id="founders">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>LEADERSHIP</span>
          <h2 className={styles.title}>
            The <span className="italic-accent">founders</span>
          </h2>
          <p className={styles.headerDesc}>
            The core engineering and design minds behind Nirvanaa Studios, building fast, functional, and growth-ready digital platforms.
          </p>
        </div>

        <div className={styles.foundersGrid}>
          {team.map((member, index) => (
            <TeamCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
