import { PrismaClient } from "@prisma/client";
import { inferAsyncReturnType } from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret";

export const createContext = async ({ req }: CreateNextContextOptions) => {
  const token = req.headers.authorization?.split(" ")[1];
  let session = null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        role: string;
      };
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (user) session = { user };
    } catch (err) {
      // Invalid token
    }
  }

  return {
    db: prisma,
    session,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
