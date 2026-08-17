import { getDatabasePayload } from '@/lib/db';
import Hero from '@/components/Hero';
import Philosophy from '@/components/Philosophy';
import ProjectGrid from '@/components/ProjectGrid';
import Stats from '@/components/Stats';
import TeamGrid from '@/components/TeamGrid';
import Contact from '@/components/Contact';

export const revalidate = 0; // Disable caching to fetch fresh database state on every load

export default function Home() {
  const { team, projects, stats } = getDatabasePayload();

  return (
    <>
      {/* Hero Intro Section (Kinetic Typography with Cursor Lens) */}
      <Hero />

      {/* About the Studio Section */}
      <Philosophy />

      {/* Signature Projects Grid */}
      <ProjectGrid projects={projects} />

      {/* Our Impact & Scale Revenue Stats */}
      <Stats stats={stats} />

      {/* The Founders Section */}
      <TeamGrid team={team} />

      {/* Contact Form CTA */}
      <Contact />
    </>
  );
}
