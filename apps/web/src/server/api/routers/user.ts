import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "change_this";

export const userRouter = createTRPCRouter({
  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (existingUser) {
        throw new Error("Email already registered");
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: "ADMIN",
        },
      });
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }),
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (!user) throw new Error("Invalid email or password");

      if (!user?.password) {
        throw new Error("Invalid credentials");
      }

      const isValid = await bcrypt.compare(input.password, user.password);
      if (!isValid) throw new Error("Invalid email or password");

      const token = jwt.sign(
        { userId: user.id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" },
      );

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),
  createUserByAdmin: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
        role: z.enum(["USER", "ADMIN"]).default("USER"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      if (existingUser) {
        throw new Error("Email already registered");
      }

      const hashedPassword = await bcrypt.hash(input.password, 12);

      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
          role: input.role,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    }),
  updateByAdmin: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email().optional(),
        name: z.string().optional(),
        role: z.enum(["USER", "ADMIN"]).optional(),
        password: z.string().min(6).optional(),
        teamId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      if (input.email) {
        const existingUser = await ctx.db.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser && existingUser.id !== input.id) {
          throw new Error("Email already registered by another user");
        }
      }

      let hashedPassword;
      if (input.password) {
        hashedPassword = await bcrypt.hash(input.password, 12);
      }

      const updatedUser = await ctx.db.user.update({
        where: { id: input.id },
        data: {
          email: input.email,
          name: input.name,
          role: input.role,
          teamId: input.teamId,
          ...(hashedPassword ? { password: hashedPassword } : {}),
        },
      });

      return {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        teamId: updatedUser.teamId,
      };
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.user.findMany({});
  }),
  getMe: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session.user?.id) {
      throw new Error("User ID is not available in session");
    }

    return ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        teamId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }),
});
