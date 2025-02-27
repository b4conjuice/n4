import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { deleteNote } from '@/server/actions'

export const noteRouter = createTRPCRouter({
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await deleteNote(input.id, '/notes')
    }),
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      }
    }),

  // TODO
  // create: publicProcedure
  //   .input(
  //     z.object({
  //       name: z.string().min(1),
  //       podcastId: z.number(),
  //       podcastEpisodeId: z.number(),
  //       text: z.string(),
  //       title: z.string(),
  //       body: z.string(),
  //       author: z.string(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     await ctx.db.insert(notes).values({
  //       podcastId: input.podcastId,
  //       podcastEpisodeId: input.podcastEpisodeId,
  //       text: input.text,
  //       title: input.title,
  //       body: input.body,
  //       author: input.author,
  //     })
  //   }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const note = await ctx.db.query.notes.findFirst({
      orderBy: (notes, { desc }) => [desc(notes.createdAt)],
    })

    return note ?? null
  }),
})
