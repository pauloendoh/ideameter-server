import { SimpleUserDto } from "../user/SimpleUserDto";

export interface InterestSimilarityDto {
  user: SimpleUserDto;
  sameIdeasRatedCount: number;
  similarityPercentage: number;
}
