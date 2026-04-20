import { prisma } from '../lib/prisma.js';

export async function rateNote(req, res) {
  try {
    const { score } = req.body;
    const { noteId } = req.params;

    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return res.status(400).json({ error: 'Score must be an integer between 1 and 5' });
    }

    const rating = await prisma.rating.upsert({
      where: { userId_noteId: { userId: req.user.id, noteId } },
      update: { score },
      create: { score, userId: req.user.id, noteId },
    });

    const allRatings = await prisma.rating.findMany({ where: { noteId } });
    const avg = allRatings.reduce((sum, r) => sum + r.score, 0) / allRatings.length;
    const avgRating = Math.round(avg * 10) / 10;

    await prisma.note.update({ where: { id: noteId }, data: { avgRating } });

    return res.status(200).json({ rating, avgRating });
  } catch (err) {
    console.error('rateNote error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getNoteRatings(req, res) {
  try {
    const ratings = await prisma.rating.findMany({
      where: { noteId: req.params.noteId },
      include: { user: { select: { id: true, name: true } } },
    });
    return res.status(200).json(ratings);
  } catch (err) {
    console.error('getNoteRatings error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
