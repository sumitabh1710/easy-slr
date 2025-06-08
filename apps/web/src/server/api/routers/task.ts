import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        priority: z.string(),
        deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        }),
        projectId: z.string(),
        assignedToId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          deadline: new Date(input.deadline),
          projectId: input.projectId,
          userId: input.assignedToId,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        assignedToId: z.string().optional(),
        deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: "Invalid date format",
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.update({
        where: { id: input.id },
        data: {
          userId: input.assignedToId,
          deadline: new Date(input.deadline),
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.delete({ where: { id: input.id } });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.task.findMany({
      include: {
        project: true,
        assignedTo: true,
      },
    });
  }),
});
