import { PrismaClient, UserRole, CourseLevel, CourseStyle } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...");

  // 1. Create a Demo Teacher
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@atyef.com" },
    update: {},
    create: {
      email: "teacher@atyef.com",
      clerkId: "user_2demo_teacher_clerk_id",
      firstName: "Marie",
      lastName: "Laurent",
      role: UserRole.TEACHER,
      bio: "Professeure de musique passionnée avec plus de 15 ans d'expérience.",
    },
  });

  console.log(`Created teacher: ${teacher.firstName} ${teacher.lastName}`);

  // 2. Create Instruments
  const instrumentsData = [
    { name: "Piano / Clavier", slug: "piano", description: "Apprenez le piano classique, jazz, pop et plus encore.", color: "#6C3CE1", sortOrder: 1 },
    { name: "Guitare", slug: "guitare", description: "Guitare acoustique et électrique. Rock, blues, folk, classique.", color: "#F59E0B", sortOrder: 2 },
    { name: "Basse", slug: "basse", description: "Basse électrique et acoustique. Grooves, slap, walking bass.", color: "#10B981", sortOrder: 3 },
    { name: "Batterie / Percussions", slug: "batterie", description: "Batterie acoustique et électronique. Rythmes, rudiments.", color: "#EF4444", sortOrder: 4 },
    { name: "Chant / Voix", slug: "chant", description: "Technique vocale, interprétation, placement de voix.", color: "#EC4899", sortOrder: 5 },
  ];

  const instruments: Record<string, string> = {};

  for (const inst of instrumentsData) {
    const created = await prisma.instrument.upsert({
      where: { slug: inst.slug },
      update: inst,
      create: inst,
    });
    instruments[inst.slug] = created.id;
  }

  console.log(`Created ${Object.keys(instruments).length} instruments`);

  // 3. Create Courses
  const coursesData = [
    {
      title: "Piano : Les Fondamentaux",
      slug: "piano-les-fondamentaux",
      description: "Un parcours complet pour maîtriser les bases du piano. Posture, lecture de notes, accords.",
      level: CourseLevel.BEGINNER,
      style: CourseStyle.CLASSICAL,
      duration: 480,
      published: true,
      featured: true,
      instrumentId: instruments["piano"],
      teacherId: teacher.id,
    },
    {
      title: "Guitare Acoustique pour Débutants",
      slug: "guitare-acoustique-debutants",
      description: "Apprenez vos premiers accords, le strumming et jouez vos chansons préférées.",
      level: CourseLevel.BEGINNER,
      style: CourseStyle.POP,
      duration: 360,
      published: true,
      featured: true,
      instrumentId: instruments["guitare"],
      teacherId: teacher.id,
    },
    {
      title: "Blues Guitar Masterclass",
      slug: "blues-guitar-masterclass",
      description: "Plongez dans le blues : gammes pentatoniques, bends, vibrato et improvisation.",
      level: CourseLevel.INTERMEDIATE,
      style: CourseStyle.BLUES,
      duration: 540,
      published: true,
      featured: true,
      instrumentId: instruments["guitare"],
      teacherId: teacher.id,
    },
  ];

  for (const course of coursesData) {
    const created = await prisma.course.upsert({
      where: { slug: course.slug },
      update: course,
      create: course,
    });

    // 4. Add some Lessons to the first course
    if (course.slug === "piano-les-fondamentaux") {
      const lessonsData = [
        { title: "Introduction au Piano", description: "Découvrez l'instrument et sa mécanique.", sortOrder: 1, duration: 600, isFree: true, courseId: created.id },
        { title: "Les Notes sur le Clavier", description: "Apprenez à identifier toutes les notes.", sortOrder: 2, duration: 720, isFree: true, courseId: created.id },
        { title: "Premiers Accords Majeurs", description: "Découvrez les accords de Do, Fa et Sol.", sortOrder: 3, duration: 900, isFree: false, courseId: created.id },
      ];

      for (const lesson of lessonsData) {
        await prisma.lesson.create({
          data: lesson,
        });
      }
    }
  }

  console.log("Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
