import { z } from "zod"

const waitingIdeaDtoSchema = z.object({
  id: z.string(),
  tabId: z.string(),
  name: z.string(),
  isDone: z.boolean(),
})

export type WaitingIdeaDto = z.infer<typeof waitingIdeaDtoSchema>
