import { Idea, Label } from "@prisma/client";

export type IdeaWithLabelsType = Idea & { labels: Label[] };
