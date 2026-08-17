'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Edit, Trash2, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { TeamMember, Project, GlobalStats } from '@/lib/db';
import styles from './admin.module.css';

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'projects' | 'team'>('projects');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  
  // Active editing IDs
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    name: '',
    category: '',
    coverImage: '',
    description: '',
    scope: '',
    toolsStr: '',
    duration: '',
    costing: 0,
    revenue: 0
  });

  // Team Form State
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    avatar: '',
    bio: '',
    skillsStr: '',
    twitter: '',
    linkedin: '',
    dribbble: ''
  });

  // Expand reviews state
  const [expandedProjectReviews, setExpandedProjectReviews] = useState<{ [key: string]: boolean }>({});

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setTeam(data.team || []);
        setStats(data.stats || null);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleReviews = (projId: string) => {
    setExpandedProjectReviews((prev) => ({
      ...prev,
      [projId]: !prev[projId]
    }));
  };

  // --- PROJECT CRUD ---

  const handleOpenAddProject = () => {
    setEditingProjectId(null);
    setProjectForm({
      name: '',
      category: '',
      coverImage: '/images/projects/hero_graphic.jpg', // default
      description: '',
      scope: 'Full Service Design & Development',
      toolsStr: 'Next.js, Vanilla CSS, Framer Motion',
      duration: '3 Months',
      costing: 25000,
      revenue: 80000
    });
    setShowProjectModal(true);
  };

  const handleOpenEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setProjectForm({
      name: project.name,
      category: project.category,
      coverImage: project.coverImage,
      description: project.description,
      scope: project.scope,
      toolsStr: project.tools.join(', '),
      duration: project.duration,
      costing: project.costing,
      revenue: project.revenue
    });
    setShowProjectModal(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingProjectId || undefined,
      name: projectForm.name,
      category: projectForm.category,
      coverImage: projectForm.coverImage,
      description: projectForm.description,
      scope: projectForm.scope,
      tools: projectForm.toolsStr.split(',').map((t) => t.trim()).filter(Boolean),
      duration: projectForm.duration,
      costing: Number(projectForm.costing),
      revenue: Number(projectForm.revenue)
    };

    try {
      const url = '/api/projects';
      const method = editingProjectId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowProjectModal(false);
        fetchData();
        router.refresh();
      } else {
        alert('Error saving project');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This will remove all associated client reviews.')) return;
    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
        router.refresh();
      } else {
        alert('Error deleting project');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (projectId: string, reviewId: string) => {
    if (!confirm('Are you sure you want to delete this client review?')) return;
    try {
      const res = await fetch(`/api/reviews?projectId=${projectId}&reviewId=${reviewId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
        router.refresh();
      } else {
        alert('Error deleting review');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- TEAM CRUD ---

  const handleOpenAddTeam = () => {
    setEditingTeamId(null);
    setTeamForm({
      name: '',
      role: '',
      avatar: '/images/team/aria.png', // default
      bio: '',
      skillsStr: 'UI/UX Design, Strategy',
      twitter: '',
      linkedin: '',
      dribbble: ''
    });
    setShowTeamModal(true);
  };

  const handleOpenEditTeam = (member: TeamMember) => {
    setEditingTeamId(member.id);
    setTeamForm({
      name: member.name,
      role: member.role,
      avatar: member.avatar,
      bio: member.bio,
      skillsStr: member.skills.join(', '),
      twitter: member.socials?.twitter || '',
      linkedin: member.socials?.linkedin || '',
      dribbble: member.socials?.dribbble || ''
    });
    setShowTeamModal(true);
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingTeamId || undefined,
      name: teamForm.name,
      role: teamForm.role,
      avatar: teamForm.avatar,
      bio: teamForm.bio,
      skills: teamForm.skillsStr.split(',').map((t) => t.trim()).filter(Boolean),
      socials: {
        twitter: teamForm.twitter || undefined,
        linkedin: teamForm.linkedin || undefined,
        dribbble: teamForm.dribbble || undefined
      }
    };

    try {
      const url = '/api/team';
      const method = editingTeamId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowTeamModal(false);
        fetchData();
        router.refresh();
      } else {
        alert('Error saving team member');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    try {
      const res = await fetch(`/api/team?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchData();
        router.refresh();
      } else {
        alert('Error deleting team member');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '200px 0' }}>
        <h2 className={styles.title}>Loading Studio Database...</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nirvanaa Studio Admin</h1>
        {stats && (
          <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
            <span>Total Projects: {stats.totalProjects}</span>
            <span>Total Revenue: {formatCurrency(stats.totalRevenue)}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === 'projects' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Manage Projects
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === 'team' ? styles.activeTabBtn : ''}`}
          onClick={() => setActiveTab('team')}
        >
          Manage Team
        </button>
      </div>

      {/* Main Content Area */}
      <div className={styles.contentArea}>
        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Portfolio Showcase Projects</h2>
              <button className={styles.addBtn} onClick={handleOpenAddProject}>
                <Plus size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                Add Project
              </button>
            </div>

            <div className={styles.listingGrid}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div className={styles.listingCard}>
                    <div className={styles.cardInfo}>
                      <img src={proj.coverImage} alt={proj.name} className={styles.thumbnail} />
                      <div className={styles.cardMeta}>
                        <span className={styles.cardName}>{proj.name}</span>
                        <span className={styles.cardSub}>{proj.category}</span>
                        <div className={styles.cardPriceRow}>
                          <span style={{ color: 'var(--color-brown)' }}>Cost: {formatCurrency(proj.costing)}</span>
                          <span style={{ color: 'green' }}>Revenue: {formatCurrency(proj.revenue)}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.actionBtns}>
                      <button
                        className={styles.editBtn}
                        onClick={() => toggleReviews(proj.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        Reviews ({proj.reviews?.length || 0})
                        {expandedProjectReviews[proj.id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                      <button className={styles.editBtn} onClick={() => handleOpenEditProject(proj)}>
                        Edit
                      </button>
                      <button className={styles.deleteBtn} onClick={() => handleDeleteProject(proj.id)}>
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Reviews block */}
                  {expandedProjectReviews[proj.id] && (
                    <div className={styles.reviewsCollapse}>
                      <h4 className={styles.reviewsCollapseTitle}>Client Endorsements for "{proj.name}"</h4>
                      {proj.reviews && proj.reviews.length > 0 ? (
                        proj.reviews.map((rev) => (
                          <div key={rev.id} className={styles.reviewItem}>
                            <div className={styles.reviewDetails}>
                              <span className={styles.reviewClient}>
                                {rev.clientName} ({rev.rating} ★)
                              </span>
                              <p className={styles.reviewText}>"{rev.reviewText}"</p>
                            </div>
                            <button
                              className={styles.deleteBtn}
                              onClick={() => handleDeleteReview(proj.id, rev.id)}
                              style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                            >
                              Delete
                            </button>
                          </div>
                        ))
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-taupe)', fontStyle: 'italic' }}>
                          No reviews registered for this project.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {activeTab === 'team' && (
          <div>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Studio Team Roster</h2>
              <button className={styles.addBtn} onClick={handleOpenAddTeam}>
                <Plus size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                Add Member
              </button>
            </div>

            <div className={styles.listingGrid}>
              {team.map((member) => (
                <div key={member.id} className={styles.listingCard}>
                  <div className={styles.cardInfo}>
                    <img src={member.avatar} alt={member.name} className={styles.thumbnail} style={{ borderRadius: '50%' }} />
                    <div className={styles.cardMeta}>
                      <span className={styles.cardName}>{member.name}</span>
                      <span className={styles.cardSub} style={{ fontWeight: 'bold' }}>{member.role}</span>
                      <span className={styles.cardSub} style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                        {member.bio}
                      </span>
                    </div>
                  </div>

                  <div className={styles.actionBtns}>
                    <button className={styles.editBtn} onClick={() => handleOpenEditTeam(member)}>
                      Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteTeam(member.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- PROJECT FORM MODAL --- */}
      {showProjectModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingProjectId ? 'Edit Project' : 'Add New Project'}</h3>
              <button className={styles.closeBtn} onClick={() => setShowProjectModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Project Name</label>
                  <input
                    type="text"
                    required
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                    className={styles.input}
                    placeholder="e.g. Chronos Digital Configurator"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Category</label>
                  <input
                    type="text"
                    required
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className={styles.input}
                    placeholder="e.g. 3D Web & Interactive"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Cover Image Path</label>
                  <input
                    type="text"
                    required
                    value={projectForm.coverImage}
                    onChange={(e) => setProjectForm({ ...projectForm, coverImage: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Scope / Details</label>
                  <input
                    type="text"
                    required
                    value={projectForm.scope}
                    onChange={(e) => setProjectForm({ ...projectForm, scope: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Tools (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={projectForm.toolsStr}
                    onChange={(e) => setProjectForm({ ...projectForm, toolsStr: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Duration</label>
                  <input
                    type="text"
                    required
                    value={projectForm.duration}
                    onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Costing / Investment ($)</label>
                  <input
                    type="number"
                    required
                    value={projectForm.costing}
                    onChange={(e) => setProjectForm({ ...projectForm, costing: Number(e.target.value) })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Revenue Generated ($)</label>
                  <input
                    type="number"
                    required
                    value={projectForm.revenue}
                    onChange={(e) => setProjectForm({ ...projectForm, revenue: Number(e.target.value) })}
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.spanFull}`}>
                  <label className={styles.formLabel}>Description</label>
                  <textarea
                    required
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className={styles.textarea}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.editBtn} onClick={() => setShowProjectModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.addBtn}>
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TEAM FORM MODAL --- */}
      {showTeamModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{editingTeamId ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button className={styles.closeBtn} onClick={() => setShowTeamModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleTeamSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={teamForm.name}
                    onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Role / Designation</label>
                  <input
                    type="text"
                    required
                    value={teamForm.role}
                    onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Avatar Path</label>
                  <input
                    type="text"
                    required
                    value={teamForm.avatar}
                    onChange={(e) => setTeamForm({ ...teamForm, avatar: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Skills (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={teamForm.skillsStr}
                    onChange={(e) => setTeamForm({ ...teamForm, skillsStr: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Twitter Link (optional)</label>
                  <input
                    type="text"
                    value={teamForm.twitter}
                    onChange={(e) => setTeamForm({ ...teamForm, twitter: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>LinkedIn Link (optional)</label>
                  <input
                    type="text"
                    value={teamForm.linkedin}
                    onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })}
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.spanFull}`}>
                  <label className={styles.formLabel}>Biography</label>
                  <textarea
                    required
                    value={teamForm.bio}
                    onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                    className={styles.textarea}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.editBtn} onClick={() => setShowTeamModal(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.addBtn}>
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
