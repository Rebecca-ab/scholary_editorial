import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const courses = [
  { name: 'Career Success in the AI era',   code: 'PAI201', department: 'Computer Science' },
  { name: 'Digital Image Processing',      code: 'CSC403', department: 'Computer Science' },
  { name: 'Advanced Web Programming',     code: 'CSC408', department: 'Computer Science' },
  { name: 'Parallel Systems',        code: 'MSE362',  department: 'Computer Science' },
  { name: 'Final Year Project', code: 'ENG510',  department: 'Computer Science' },
];

async function main() {
  const keepCodes = courses.map((c) => c.code);

  console.log('Removing old courses...');
  await prisma.rating.deleteMany({ where: { note: { course: { code: { notIn: keepCodes } } } } });
  await prisma.comment.deleteMany({ where: { note: { course: { code: { notIn: keepCodes } } } } });
  await prisma.note.deleteMany({ where: { course: { code: { notIn: keepCodes } } } });
  await prisma.course.deleteMany({ where: { code: { notIn: keepCodes } } });

  console.log('Seeding courses...');
  for (const course of courses) {
    await prisma.course.upsert({
      where: { code: course.code },
      update: course,
      create: course,
    });
  }
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
