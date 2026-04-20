import { prisma } from '../lib/prisma.js';

export async function addComment(req, res) {
  try {
    const { body } = req.body;
    const { noteId } = req.params;

    if (!body || !body.trim()) {
      return res.status(400).json({ error: 'Comment cannot be empty' });
    }

    const comment = await prisma.comment.create({
      data: { body: body.trim(), userId: req.user.id, noteId },
      include: { user: { select: { id: true, name: true } } },
    });

    return res.status(201).json(comment);
  } catch (err) {
    console.error('addComment error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getComments(req, res) {
  try {
    const comments = await prisma.comment.findMany({
      where: { noteId: req.params.noteId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, university: true } } },
    });
    return res.status(200).json(comments);
  } catch (err) {
    console.error('getComments error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteComment(req, res) {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.id } });
    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (req.user.id !== comment.userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await prisma.comment.delete({ where: { id: comment.id } });
    return res.status(200).json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('deleteComment error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
