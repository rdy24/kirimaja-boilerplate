import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

export async function rolesSeed() {
    const rolesPath = path.resolve(__dirname, 'data', 'roles.json');
    const rolesRaw = fs.readFileSync(rolesPath, 'utf-8');
    const roles = JSON.parse(rolesRaw).data;

    // check if roles already exist
    const existingRoles = await prisma.role.findMany({
        where: {
            key: {
                in: roles.map((role) => role.key),
            },
        },
    });
    const existingRoleKeys = existingRoles.map((role) => role.key);
    const newRoles = roles.filter(
        (role) => !existingRoleKeys.includes(role.key),
    );
    if (newRoles.length === 0) {
        console.log('⚠️  Semua role sudah ada. Lewat.');
        return;
    }
    // create new roles

    await prisma.role.createMany({
        data: roles,
        skipDuplicates: true,
    });

    console.log('✅ Roles seeded');
}
