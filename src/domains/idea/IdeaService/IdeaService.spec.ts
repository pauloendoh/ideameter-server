import { instance, mock, when } from "ts-mockito";
import { describe, expect, test } from "vitest";
import IdeaRepository from "../IdeaRepository";
import IdeaService from "./IdeaService";
describe("IdeaService", () => {
  describe("createIdea", () => {
    test("when idea not found -> should throw error", async () => {
      const mockedIdeaRepo = mock(IdeaRepository);
      when(mockedIdeaRepo.findById("123")).thenResolve(null);

      const ideaRepo = instance(mockedIdeaRepo);
      const ideaService = new IdeaService(ideaRepo);

      expect(() => ideaService.deleteIdea("123", "123")).rejects.toThrow();
    });
  });
});
