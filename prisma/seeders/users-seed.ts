import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

export async function usersSeed() {
    const usersPath = path.resolve(__dirname, 'data', 'users.json');
    const usersRaw = fs.readFileSync(usersPath, 'utf-8');
    const users = JSON.parse(usersRaw).data;

    for (const user of users) {
        const role = await prisma.role.findFirst({
            where: { key: user.roleKey },
        });

        if (!role) {
            console.warn(
                `⚠️  Role dengan key "${user.roleKey}" tidak ditemukan. Lewat.`,
            );
            continue;
        }

        const hashedPassword = await bcrypt.hash(user.password, 12);

        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
                avatar: user.avatar,
                phoneNumber: user.phoneNumber,
                roleId: role.id,
            },
        });

        console.log(`✅ User untuk role "${user.roleKey}" ditambahkan`);
    }
}
