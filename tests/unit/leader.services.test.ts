import { jest, describe, it, beforeEach, expect } from '@jest/globals';

const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();

jest.unstable_mockModule("../../src/models/prisma.js", () => ({
  default: {
    leader: {
      findMany: mockFindMany,
      findUnique: mockFindUnique,
    },
  },
}));

const { getLeaders, getLeaderById } = await import("../../src/services/leader.services.js");

describe("Leader Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getLeaders", () => {
    it("omits userId from the response", async () => {
      mockFindMany.mockResolvedValue([{ id: "1", name: "Public" }]);
      const result = await getLeaders();
      
      expect(result[0].userId).toBeUndefined();
      expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
        select: expect.not.objectContaining({
          userId: true
        })
      }));
    });
  });

  describe("getLeaderById", () => {
    it("omits userId from the response", async () => {
      mockFindUnique.mockResolvedValue({ id: "1", name: "Public" });
      const result = await getLeaderById("1");
      
      expect(result.userId).toBeUndefined();
      expect(mockFindUnique).toHaveBeenCalledWith(expect.objectContaining({
        select: expect.not.objectContaining({
          userId: true
        })
      }));
    });
  });
});
