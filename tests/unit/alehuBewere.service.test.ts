import { jest, describe, it, beforeEach, expect } from '@jest/globals';

const mockUpdate = jest.fn();
const mockFindUnique = jest.fn();

jest.unstable_mockModule("../../src/models/prisma.js", () => ({
  default: {
    subscription: {
      update: mockUpdate,
      findUnique: mockFindUnique,
    },
  },
}));

const { updateSubscriptionStatus } = await import("../../src/services/alehuBewere.service.js");

describe("Alehu Bewere Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("updateSubscriptionStatus", () => {
    it("updates status and admin_note", async () => {
      mockFindUnique.mockResolvedValue({ id: "1" });
      mockUpdate.mockResolvedValue({ id: "1", status: "CONFIRMED", admin_note: "test" });
      
      await updateSubscriptionStatus("1", "CONFIRMED", "test");
      
      expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "1" },
        data: expect.objectContaining({
          status: "CONFIRMED",
          admin_note: "test",
        }),
      }));
    });
  });
});
