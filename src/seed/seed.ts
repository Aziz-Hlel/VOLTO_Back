import { PrismaClient } from '@prisma/client';
import seedUsers from './data/users.seeds';
import seedEvents from './data/events.seeds';
import { seedGallery } from './data/gallery.seed';

const prisma = new PrismaClient();

const resetDB = async () => {
  console.log('❗Reseting DB...');
  await prisma.user.deleteMany();
  await prisma.media.deleteMany();
  await prisma.event.deleteMany();
};

async function main() {
  console.log('🌱 Seeding started... ');

  await resetDB();

  await seedUsers();
  await seedEvents();

  await seedGallery();

  await prisma.$disconnect();
}

main()
  .then(() => console.log('🌱 Seeding completed successfully.'))
  .catch((error) => {
    console.error('Error during seeding:', error);
    prisma.$disconnect();
  });
