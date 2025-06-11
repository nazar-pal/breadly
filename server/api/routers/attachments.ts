import { attachments } from '@/server/db/schema/table_8_attachments'
import { createInsertSchema } from 'drizzle-zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const createAttachmentSchema = createInsertSchema(attachments)

export const attachmentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createAttachmentSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .insert(attachments)
        .values(input)
        .returning({ id: attachments.id })
        .then(result => result[0])
    })
})
