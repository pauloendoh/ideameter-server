import myPrismaClient from "../../utils/myPrismaClient"
import { MissingRatingDto } from "./types/MissingRatingDto"

export class InsightRepository {
  constructor(private readonly prismaClient = myPrismaClient) {}

  async findMissingRatingsFromGroup(groupId: string) {
    await this.prismaClient.$queryRaw`DROP TABLE IF EXISTS subideas_to_rate;`
    await this.prismaClient.$queryRaw`
    CREATE TEMP TABLE subideas_to_rate AS (
      SELECT subidea.id, subidea.name  
        FROM "Idea"     subidea 
	INNER JOIN "Idea"     idea    ON idea.id = subidea."parentId" 
	INNER JOIN "GroupTab" gt      ON   gt.id = idea."tabId" 
	INNER JOIN "Group"    g       ON    g.id = gt."groupId" 
	     WHERE subidea."isDone" IS FALSE
	       AND g.id = ${groupId});`

    await this.prismaClient.$queryRaw`DROP TABLE IF EXISTS ideas_with_subideas;`
    await this.prismaClient.$queryRaw`
      CREATE TEMP TABLE ideas_with_subideas AS (
        SELECT idea."id", 
               idea."name"	
	        FROM "Idea" 		subidea
    INNER JOIN "Idea" 		idea 	    ON 	idea.id = subidea."parentId" 
    INNER JOIN "GroupTab"	gt 		    ON  gt.id 	= idea."tabId"
    INNER JOIN "Group" 		g 		    ON  g.id 	= gt."groupId"
	  WHERE g.id = ${groupId}
 GROUP BY idea."id", idea."name");`

    await this.prismaClient.$queryRaw`DROP TABLE IF EXISTS ideas_to_rate; `
    await this.prismaClient.$queryRaw`
      CREATE TEMP TABLE ideas_to_rate AS (
        SELECT i.id, i."name"  
          from "Idea" i 
	   left join "GroupTab"           gt  on gt.id  = i."tabId" 
	   left join "Group"              g   on g.id   = gt."groupId" 
	   left join ideas_with_subideas  iws on iws.id = i.id 
	       where i."parentId" is null
	         and i."isDone" = false
	         and iws.id is null
	         and g.id = ${groupId}
	);`

    await this.prismaClient.$queryRaw`DROP TABLE IF EXISTS all_to_rate; `
    await this.prismaClient.$queryRaw`
      CREATE TEMP TABLE all_to_rate AS (
        SELECT * FROM ideas_to_rate 
         UNION 
        SELECT * FROM subideas_to_rate);`

    const result = await this.prismaClient.$queryRaw<
      MissingRatingDto[]
    >`SELECT u.id, 
             u.username, 
             (SELECT count(*)::INTEGER 
                FROM all_to_rate atr 
           LEFT JOIN "IdeaRating" ir ON ir."ideaId" = atr.id 
                 AND ir."userId" = u.id
               WHERE ir.id IS NULL) AS count
        FROM "Group" g
   LEFT JOIN "UserGroup" ug ON ug."groupId" = g.id 
   LEFT JOIN "User" 		u  ON u.id = ug."userId" 
       WHERE g.id  = ${groupId};`

    return result
  }
}
