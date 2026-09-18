import { jest, describe, it, beforeEach, expect } from '@jest/globals';

const mockFindUnique = jest.fn();
jest.unstable_mockModule("../../src/models/prisma.js", () => ({
  default: {
    announcement: {
      findUnique: mockFindUnique,
    },
    adminScope: {
      findUnique: jest.fn(),
    }
  },
}));

const { getAnnouncementById, listActiveAnnouncements } = await import("../../src/services/announcement.service.js");

describe("Announcement Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAnnouncementById", () => {
    it("public route applies active and expiry filters and omits userId", async () => {
      mockFindUnique.mockResolvedValue({ id: "1", title: "Public", is_active: true });
      const result = await getAnnouncementById("1", true);
      
      expect(result.userId).toBeUndefined();
      expect(mockFindUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          id: "1",
          is_active: true,
          expires_at: expect.any(Object), // { gt: new Date() }
        },
        select: expect.not.objectContaining({
          userId: true
        })
      }));
    });

    it("admin route bypasses filters and includes userId", async () => {
      mockFindUnique.mockResolvedValue({ id: "1", title: "Admin", is_active: false, userId: "u1" });
      await getAnnouncementById("1", false);
      
      expect(mockFindUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "1" }, // No is_active or expires_at
        select: expect.objectContaining({
          userId: true
        })
      }));
    });
  });

  describe("listActiveAnnouncements", () => {
    it("omits userId from the response", async () => {
      const mockFindMany = jest.fn().mockResolvedValue([]);
      const prisma = (await import("../../src/models/prisma.js")).default;
      prisma.announcement.findMany = mockFindMany as any;

      await listActiveAnnouncements();
      
      expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
        select: expect.not.objectContaining({
          userId: true
        })
      }));
    });
  });
});
