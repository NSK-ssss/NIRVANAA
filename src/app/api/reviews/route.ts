import { NextResponse } from 'next/server';
import { getRawDatabase, saveDatabase, Review } from '@/lib/db';

// POST: Add a review under a specific project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, clientName, rating, reviewText } = body;

    if (!projectId || !clientName || !rating || !reviewText) {
      return NextResponse.json({ error: 'Missing required parameters (projectId, clientName, rating, reviewText)' }, { status: 400 });
    }

    const db = getRawDatabase();
    const index = db.projects.findIndex((p) => p.id === projectId);

    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      clientName: String(clientName).trim(),
      rating: Math.min(Math.max(Number(rating) || 5, 1), 5), // bound rating between 1 and 5
      reviewText: String(reviewText).trim(),
      date: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    };

    if (!db.projects[index].reviews) {
      db.projects[index].reviews = [];
    }

    db.projects[index].reviews.push(newReview);
    saveDatabase(db);

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Error adding client review:', error);
    return NextResponse.json({ error: 'Failed to add client review' }, { status: 500 });
  }
}

// DELETE: Delete a review from a specific project
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const reviewId = searchParams.get('reviewId');

    if (!projectId || !reviewId) {
      return NextResponse.json({ error: 'Missing required parameters (projectId, reviewId)' }, { status: 400 });
    }

    const db = getRawDatabase();
    const index = db.projects.findIndex((p) => p.id === projectId);

    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = db.projects[index];
    const initialLength = project.reviews?.length || 0;
    project.reviews = (project.reviews || []).filter((r) => r.id !== reviewId);

    if (project.reviews.length === initialLength) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
