import { notFound } from 'next/navigation';
import { getDatabasePayload } from '@/lib/db';
import ProjectDetailContent from '@/components/ProjectDetailContent';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 0; // Fresh database content on navigation

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const { projects } = getDatabasePayload();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectDetailContent project={project} />;
}
