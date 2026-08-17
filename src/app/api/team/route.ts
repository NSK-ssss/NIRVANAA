import { NextResponse } from 'next/server';
import { getRawDatabase, saveDatabase, TeamMember } from '@/lib/db';

// POST: Add a new team member
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = getRawDatabase();

    const newMember: TeamMember = {
      id: `team-${Date.now()}`,
      name: body.name || 'Anonymous Studio Member',
      role: body.role || 'Creative Partner',
      avatar: body.avatar || '/images/team/placeholder.png',
      bio: body.bio || '',
      skills: Array.isArray(body.skills) ? body.skills : [],
      socials: body.socials || {}
    };

    db.team.push(newMember);
    saveDatabase(db);

    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    console.error('Error adding team member:', error);
    return NextResponse.json({ error: 'Failed to add team member' }, { status: 500 });
  }
}

// PUT: Update an existing team member
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Team member ID is required' }, { status: 400 });
    }

    const db = getRawDatabase();
    const index = db.team.findIndex((m) => m.id === body.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    db.team[index] = {
      ...db.team[index],
      name: body.name !== undefined ? body.name : db.team[index].name,
      role: body.role !== undefined ? body.role : db.team[index].role,
      avatar: body.avatar !== undefined ? body.avatar : db.team[index].avatar,
      bio: body.bio !== undefined ? body.bio : db.team[index].bio,
      skills: Array.isArray(body.skills) ? body.skills : db.team[index].skills,
      socials: body.socials !== undefined ? { ...db.team[index].socials, ...body.socials } : db.team[index].socials,
    };

    saveDatabase(db);
    return NextResponse.json({ success: true, member: db.team[index] });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

// DELETE: Remove a team member
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Team member ID is required' }, { status: 400 });
    }

    const db = getRawDatabase();
    const initialLength = db.team.length;
    db.team = db.team.filter((m) => m.id !== id);

    if (db.team.length === initialLength) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    saveDatabase(db);
    return NextResponse.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
