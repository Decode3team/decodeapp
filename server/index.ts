import { z } from "zod";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    console.log("number");

    return [10, 20, 30];
  }),

  hello: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ input }) => {
      return `Hello, ${input.name}`;
    }),
});

export type AppRouter = typeof appRouter;
