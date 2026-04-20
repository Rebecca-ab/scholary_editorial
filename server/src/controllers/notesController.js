import fs from 'fs';
import { prisma } from '../lib/prisma.js';

const userSelect = { id: true, name: true, university: true };
const courseSelect = { id: true, name: true, code: true, department: true };

export async function uploadNote(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { title, description, courseId, pageCount } = req.body;

    const note = await prisma.note.create({
      data: {
        title,
        description,
        courseId,
        pageCount: pageCount ? parseInt(pageCount) : null,
        userId: req.user.id,
        filePath: req.file.path,
        fileType: req.file.mimetype,
      },
      include: {
        user: { select: userSelect },
        course: { select: courseSelect },
      },
    });

    return res.status(201).json(note);
  } catch (err) {
    console.error('uploadNote error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getNotes(req, res) {
  try {
    const { courseId, search, sort } = req.query;

    const where = {};
    if (courseId) where.courseId = courseId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'top_rated') orderBy = { avgRating: 'desc' };
    else if (sort === 'downloads') {
      orderBy = { totalDownloads: 'desc' };
      where.totalDownloads = { gt: 0 };
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy,
      include: {
        user: { select: userSelect },
        course: { select: courseSelect },
      },
    });

    return res.status(200).json(notes);
  } catch (err) {
    console.error('getNotes error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await prisma.note.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: userSelect },
        course: { select: courseSelect },
        ratings: true,
        comments: {
          include: { user: { select: userSelect } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!note) return res.status(404).json({ error: 'Note not found' });

    return res.status(200).json(note);
  } catch (err) {
    console.error('getNoteById error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function downloadNote(req, res) {
  try {
    const note = await prisma.note.findUnique({ where: { id: req.params.id } });
    if (!note) return res.status(404).json({ error: 'Note not found' });

    if (!fs.existsSync(note.filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    await prisma.note.update({
      where: { id: note.id },
      data: { totalDownloads: { increment: 1 } },
    });

    return res.download(note.filePath);
  } catch (err) {
    console.error('downloadNote error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteNote(req, res) {
  try {
    const note = await prisma.note.findUnique({ where: { id: req.params.id } });
    if (!note) return res.status(404).json({ error: 'Note not found' });

    if (req.user.id !== note.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (fs.existsSync(note.filePath)) {
      fs.unlinkSync(note.filePath);
    }

    await prisma.note.delete({ where: { id: note.id } });

    return res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    console.error('deleteNote error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
