import { prisma } from '../lib/prisma.js';

export async function getCourses(req, res) {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [{ department: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { notes: true } } },
    });
    return res.status(200).json(courses);
  } catch (err) {
    console.error('getCourses error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        notes: {
          include: { user: { select: { id: true, name: true, university: true } } },
        },
      },
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    return res.status(200).json(course);
  } catch (err) {
    console.error('getCourseById error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
