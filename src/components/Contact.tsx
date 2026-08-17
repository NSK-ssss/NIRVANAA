'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, CheckCircle2, Send, AlertCircle, Loader2 } from 'lucide-react';
import { InstagramIcon } from './SocialIcons';
import styles from './Contact.module.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '409ed371-5c6d-4ff8-bdb3-1d8dca297c2f';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    botcheck: false,
  });

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const errors = { name: '', email: '', message: '' };
    let isValid = true;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = 'Please enter your name (at least 2 characters).';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address.';
      isValid = false;
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
      isValid = false;
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errors.message = 'Please provide a project synopsis or message (at least 5 characters).';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev) => ({ ...prev, [name]: val }));

    // Clear field-specific error as user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Client-side validation
    if (!validateForm()) {
      return;
    }

    // 2. Honeypot check
    if (formData.botcheck) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 3. Dispatch directly to Web3Forms API
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Enquiry from Nirvana Studios Website - ${formData.name.trim()}`,
          from_name: 'Nirvana Studios Website',
          name: formData.name.trim(),
          email: formData.email.trim(),
          replyto: formData.email.trim(), // Explicit Reply-To header pointing to the visitor
          phone: formData.phone.trim() || 'Not provided',
          message: formData.message.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
        // Clear form fields on successful delivery
        setFormData({ name: '', email: '', phone: '', message: '', botcheck: false });
        setFormErrors({ name: '', email: '', message: '' });
      } else {
        setErrorMessage(data.message || 'Unable to send enquiry right now. Please try again or email us directly.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setErrorMessage('Network connection error. Please try again or reach us directly at nirvanaastudios@yahoo.com');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <section className={`section-spotlight section-spotlight-bottom ${styles.contactSection}`} id="contact">
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        {/* Left Info Column */}
        <motion.div className={styles.infoColumn} variants={itemVariants}>
          <span className={styles.label}>START A CONVERSATION</span>
          <h2 className={styles.headline}>
            Let's build something that <span className="italic-accent">scales</span>.
          </h2>
          <p className={styles.desc}>
            Have a project in mind, need a fast custom web application, or want to scale your digital presence? We are based in Solapur and work with businesses worldwide.
          </p>

          <div className={styles.detailsList}>
            {/* Email */}
            <div className={styles.detailItem}>
              <div className={styles.iconCircle}>
                <Mail size={16} color="#ff5e28" />
              </div>
              <div>
                <span className={styles.detailLabel}>Direct Business Email</span>
                <a href="mailto:nirvanaastudios@yahoo.com" className={styles.detailValue}>
                  nirvanaastudios@yahoo.com
                </a>
              </div>
            </div>

            {/* Location */}
            <div className={styles.detailItem}>
              <div className={styles.iconCircle}>
                <MapPin size={16} color="#38bdf8" />
              </div>
              <div>
                <span className={styles.detailLabel}>Studio Location</span>
                <span className={styles.detailValue}>WIT Boys Hostel, Solapur</span>
              </div>
            </div>

            {/* Status Pulse */}
            <div className={styles.detailItem}>
              <div className={styles.statusDot} />
              <div>
                <span className={styles.detailLabel}>Project Availability</span>
                <span className={styles.detailValue} style={{ color: '#38bdf8' }}>
                  Available for new commissions
                </span>
              </div>
            </div>
          </div>

          {/* Socials Block */}
          <div className={styles.socialsBlock} id="socials">
            <span className={styles.socialsLabel}>CONNECT ON INSTAGRAM</span>
            <div className={styles.socialIconsRow}>
              <a
                href="https://www.instagram.com/nirvanaastudios?igsh=MWVnMGZwZmNyNDE5dg=="
                target="_blank"
                rel="noreferrer"
                className={styles.instagramLinkBtn}
                aria-label="Nirvanaa Studios Instagram"
              >
                <InstagramIcon size={18} />
                <span>@nirvanaastudios</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Form Card */}
        <motion.div className={`${styles.formCard} glass-card`} variants={itemVariants}>
          <h3 className={styles.formTitle}>PROJECT ENQUIRY</h3>
          
          <form onSubmit={handleSubmit} noValidate>
            {/* Honeypot Spam Protection (Hidden from legitimate users) */}
            <input
              type="checkbox"
              name="botcheck"
              id="botcheck"
              checked={formData.botcheck}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              style={{ display: 'none' }}
              aria-hidden="true"
            />

            {/* Name Field */}
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                YOUR NAME *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={`${styles.input} ${formErrors.name ? styles.inputError : ''}`}
                placeholder="e.g. Rahul Sharma"
              />
              {formErrors.name && (
                <span className={styles.fieldErrorText}>{formErrors.name}</span>
              )}
            </div>

            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={`${styles.input} ${formErrors.email ? styles.inputError : ''}`}
                placeholder="rahul@business.in"
              />
              {formErrors.email && (
                <span className={styles.fieldErrorText}>{formErrors.email}</span>
              )}
            </div>

            {/* Phone Field (Optional) */}
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.formLabel}>
                PHONE NUMBER (OPTIONAL)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isSubmitting}
                className={styles.input}
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Project Synopsis / Message Field */}
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.formLabel}>
                PROJECT SYNOPSIS / MESSAGE *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className={`${styles.textarea} ${formErrors.message ? styles.inputError : ''}`}
                rows={4}
                placeholder="Describe your project goals, scope, and desired timeline..."
              />
              {formErrors.message && (
                <span className={styles.fieldErrorText}>{formErrors.message}</span>
              )}
            </div>

            {/* Submit Button with Loading State */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-orange"
              style={{ width: '100%', padding: '16px 28px', fontSize: '0.95rem' }}
            >
              {isSubmitting ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 size={18} className={styles.spinnerIcon} /> SENDING MESSAGE...
                </span>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  SEND MESSAGE <Send size={16} />
                </span>
              )}
            </button>

            {/* In-Place Success Alert */}
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.successMessage}
              >
                <CheckCircle2 size={22} color="#ff5e28" style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ color: '#ffffff', display: 'block', marginBottom: '2px' }}>
                    Thanks! We'll get back to you shortly.
                  </strong>
                  <p style={{ fontSize: '0.82rem', margin: 0, color: 'var(--text-secondary)' }}>
                    Your enquiry has been delivered to <strong>nirvanaastudios@yahoo.com</strong>.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Non-Destructive Error Alert */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={styles.errorMessage}
              >
                <AlertCircle size={18} color="#f87171" style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </section>
  );
}
