import { NextResponse } from 'next/server';
import { getRawDatabase, saveDatabase, Project } from '@/lib/db';

// POST: Add a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getRawDatabase();

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: body.name || 'Untitled Project',
      category: body.category || 'Creative Direction',
      coverImage: body.coverImage || '/images/projects/placeholder.png',
      images: body.images || [],
      description: body.description || '',
      scope: body.scope || '',
      tools: Array.isArray(body.tools) ? body.tools : [],
      duration: body.duration || 'Flexible',
      costing: Number(body.costing) || 0,
      revenue: Number(body.revenue) || 0,
      reviews: []
    };

    db.projects.push(newProject);
    saveDatabase(db);

    return NextResponse.json({ success: true, project: newProject });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}

// PUT: Update an existing project
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const db = getRawDatabase();
    const index = db.projects.findIndex((p) => p.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Keep existing reviews and update other fields
    db.projects[index] = {
      ...db.projects[index],
      name: body.name !== undefined ? body.name : db.projects[index].name,
      category: body.category !== undefined ? body.category : db.projects[index].category,
      coverImage: body.coverImage !== undefined ? body.coverImage : db.projects[index].coverImage,
      images: body.images !== undefined ? body.images : db.projects[index].images,
      description: body.description !== undefined ? body.description : db.projects[index].description,
      scope: body.scope !== undefined ? body.scope : db.projects[index].scope,
      tools: Array.isArray(body.tools) ? body.tools : db.projects[index].tools,
      duration: body.duration !== undefined ? body.duration : db.projects[index].duration,
      costing: body.costing !== undefined ? Number(body.costing) : db.projects[index].costing,
      revenue: body.revenue !== undefined ? Number(body.revenue) : db.projects[index].revenue,
    };

    saveDatabase(db);
    return NextResponse.json({ success: true, project: db.projects[index] });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE: Remove a project
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const db = getRawDatabase();
    const initialLength = db.projects.length;
    db.projects = db.projects.filter((p) => p.id !== id);

    if (db.projects.length === initialLength) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
