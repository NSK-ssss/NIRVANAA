'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Clock, Briefcase, Award, TrendingUp } from 'lucide-react';
import { Project } from '@/lib/db';
import styles from './projectDetail.module.css';

interface ProjectDetailContentProps {
  project: Project;
}

export default function ProjectDetailContent({ project }: ProjectDetailContentProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({ clientName: '', rating: 5, reviewText: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName || !formData.reviewText) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          clientName: formData.clientName,
          rating: Number(formData.rating),
          reviewText: formData.reviewText,
        }),
      });

      if (res.ok) {
        setSuccessMsg('Review added successfully! Thank you.');
        setFormData({ clientName: '', rating: 5, reviewText: '' });
        router.refresh();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < rating ? '#ff5e28' : 'none'}
        stroke={i < rating ? '#ff5e28' : 'rgba(255,255,255,0.3)'}
      />
    ));
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Top spotlight glow */}
      <div className={styles.spotlightGlow} aria-hidden="true" />

      <div className={styles.container}>
        {/* Back Link */}
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={16} /> RETURN TO SHOWCASE
        </Link>

        {/* Header Title & URL */}
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span className={styles.categoryBadge}>{project.category}</span>
            {project.url && (
              <a
                href={`https://${project.url}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#38bdf8',
                  background: 'rgba(56, 189, 248, 0.08)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  textDecoration: 'none'
                }}
              >
                🌐 {project.url} ↗
              </a>
            )}
          </div>
          <h1 className={styles.title}>{project.name}</h1>
        </div>

        {/* Hero Image */}
        <div className={styles.heroImageWrapper}>
          <img
            src={project.coverImage || '/images/projects/aether_cover.png'}
            alt={project.name}
            className={styles.heroImage}
          />
          <div className={styles.heroImageOverlay} />
        </div>

        {/* Financial Metrics Cards */}
        <div className={styles.financialsGrid}>
          <div className={`${styles.financialCard} glass-card`}>
            <div className={styles.statIconCircle} style={{ background: 'var(--color-orange-subtle)' }}>
              <TrendingUp size={20} color="#ff5e28" />
            </div>
            <div>
              <span className={styles.financialLabel}>STATUS / LIFETIME VALUE</span>
              <span className={styles.financialRevenue}>{formatCurrency(project.revenue)}</span>
            </div>
          </div>
        </div>

        {/* Details Two-Column Grid */}
        <div className={styles.detailsGrid}>
          {/* Left: Project Brief */}
          <div className={`${styles.descriptionBox} glass-card`}>
            <h3 className={styles.boxTitle}>PROJECT BRIEF & APPROACH</h3>
            <p className={styles.desc}>{project.description}</p>
          </div>

          {/* Right: Specifications & Scope */}
          <div className={`${styles.metaBox} glass-card`}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                <Briefcase size={14} className={styles.metaIcon} /> SCOPE OF WORK
              </span>
              <span className={styles.metaValue}>{project.scope}</span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                <Clock size={14} className={styles.metaIcon} /> PROJECT DURATION
              </span>
              <span className={styles.metaValue}>{project.duration}</span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                <Award size={14} className={styles.metaIcon} /> TOOLS & STACK
              </span>
              <div className={styles.toolsContainer}>
                {project.tools.map((tool) => (
                  <span key={tool} className={styles.toolBadge}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        {project.images && project.images.length > 0 && (
          <div className={styles.gallerySection}>
            <h2 className={styles.sectionHeading}>
              Visual System <span className="italic-accent">elements</span>
            </h2>
            <div className={styles.galleryGrid}>
              {project.images.map((imgUrl, index) => (
                <div key={index} className={`${styles.galleryImageWrapper} glass-card`}>
                  <img
                    src={imgUrl}
                    alt={`${project.name} preview ${index + 1}`}
                    className={styles.galleryImage}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client Reviews Section */}
        <div className={styles.reviewsSection} id="reviews">
          <div className={styles.reviewsHeader}>
            <span className={styles.reviewsTag}>VERIFIED ENDORSEMENTS</span>
            <h2 className={styles.sectionHeading}>
              Client <span className="italic-accent">reviews</span>
            </h2>
          </div>
          
          <div className={styles.reviewsGrid}>
            {project.reviews && project.reviews.length > 0 ? (
              project.reviews.map((rev) => (
                <div key={rev.id} className={`${styles.reviewCard} glass-card`}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.clientName}>{rev.clientName}</span>
                    <div className={styles.stars}>{renderStars(rev.rating)}</div>
                  </div>
                  <p className={styles.reviewText}>"{rev.reviewText}"</p>
                  <span className={styles.reviewDate}>Dated: {rev.date}</span>
                </div>
              ))
            ) : (
              <div className={`${styles.reviewCard} glass-card`} style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                  No verified client reviews submitted for this project yet. Submit your feedback below.
                </p>
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <div className={`${styles.reviewFormCard} glass-card`}>
            <h3 className={styles.boxTitle}>SUBMIT CLIENT FEEDBACK</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="clientName" className={styles.formLabel}>
                    CLIENT NAME / COMPANY
                  </label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    placeholder="e.g. Sophia Loren, Aether Skincare"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="rating" className={styles.formLabel}>
                    RATING (STARS)
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className={styles.select}
                    disabled={isSubmitting}
                  >
                    <option value="5">★★★★★ (5 Stars - Exceptional)</option>
                    <option value="4">★★★★☆ (4 Stars - Highly Satisfied)</option>
                    <option value="3">★★★☆☆ (3 Stars - Good)</option>
                    <option value="2">★★☆☆☆ (2 Stars - Fair)</option>
                    <option value="1">★☆☆☆☆ (1 Star - Needs Improvement)</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="reviewText" className={styles.formLabel}>
                  DETAILED TESTIMONIAL
                </label>
                <textarea
                  id="reviewText"
                  name="reviewText"
                  value={formData.reviewText}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  placeholder="Share your experience working with Nirvanaa Studios, the outcome, and commercial growth..."
                  className={styles.textarea}
                  rows={4}
                />
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-orange">
                {isSubmitting ? 'TRANSMITTING FEEDBACK...' : 'SUBMIT ENDORSEMENT'}
              </button>

              {successMsg && (
                <div className={styles.successMessage}>
                  ✓ {successMsg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
