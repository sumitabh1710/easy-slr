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

  getAll: protectedProcedure.query(async ({ ctx }) => {
     console.log("SESSION:", ctx.session);
    return ctx.db.task.findMany();
  }),
});
