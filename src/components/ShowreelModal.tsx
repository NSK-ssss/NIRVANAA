'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import styles from './ShowreelModal.module.css';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShowreelModal({ isOpen, onClose }: ShowreelModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Dynamic cinematic animation on canvas when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      time += 0.02;
      const w = canvas.width;
      const h = canvas.height;

      // Dark background gradient
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, 20, w * 0.5, h * 0.5, w * 0.6);
      bgGrad.addColorStop(0, '#0d1829');
      bgGrad.addColorStop(0.5, '#0a0e14');
      bgGrad.addColorStop(1, '#05070a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Draw animated cinematic geometric 3D rings & cybernetic waves
      ctx.save();
      ctx.translate(w / 2, h / 2);

      const numRings = 7;
      for (let i = 0; i < numRings; i++) {
        const radius = (i + 1) * 32 + Math.sin(time * 1.5 + i) * 12;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        const ringAlpha = 0.2 + (i / numRings) * 0.4;
        
        if (i % 2 === 0) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
        } else {
          ctx.strokeStyle = `rgba(255, 94, 40, ${ringAlpha})`;
        }
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pulsing nodes on ring
        const angle = time * (i % 2 === 0 ? 1 : -1) + (i * Math.PI) / 3;
        const nodeX = Math.cos(angle) * radius;
        const nodeY = Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 4, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#ff5e28';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      if (isPlaying) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isOpen, isPlaying]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={styles.header}>
              <div className={styles.titleInfo}>
                <span className={styles.badge}>SHOWREEL 2026</span>
                <h3 className={styles.title}>Nirvanaa Studios — Cinematic Reel</h3>
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                <X size={20} />
              </button>
            </div>

            {/* Video / Visualizer Player Area */}
            <div className={styles.playerWrapper}>
              <canvas ref={canvasRef} className={styles.canvas} />
              
              <div className={styles.overlayText}>
                <span className={styles.cinematicText}>EXPERIENCE CINEMATIC EXCELLENCE</span>
                <p className={styles.caption}>WebGL Shaders • Kinetic Typography • Generative Systems</p>
              </div>

              {/* Controls bar */}
              <div className={styles.controlsBar}>
                <button
                  className={styles.controlBtn}
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>

                <div className={styles.progressBar}>
                  <div className={styles.progressFill} />
                </div>

                <button
                  className={styles.controlBtn}
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
