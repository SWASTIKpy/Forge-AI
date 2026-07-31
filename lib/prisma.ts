import { PrismaClient } from "./generated/prisma/client";

function createPrismaClient(): PrismaClient {
    return new PrismaClient();
}

