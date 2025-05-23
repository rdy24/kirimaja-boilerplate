import { PrismaClient } from '@prisma/client';
import { rolesSeed } from './roles-seed';
import { usersSeed } from './users-seed';

const prisma = new PrismaClient();

async function main() {
    await rolesSeed();
    await usersSeed();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
