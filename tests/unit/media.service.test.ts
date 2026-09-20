import { jest, describe, it, beforeEach, expect } from "@jest/globals";

// ── Mock prisma before any service import ──────────────────────────────────────
const mockCreate = jest.fn();
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockCount = jest.fn();

jest.unstable_mockModule("../../src/models/prisma.js", () => ({
  default: {
    mediaItem: {
      create: mockCreate,
      findMany: mockFindMany,
      findUnique: mockFindUnique,
      update: mockUpdate,
      delete: mockDelete,
      count: mockCount,
    },
    $transaction: jest.fn((ops: unknown[]) => Promise.all(ops)),
  },
}));

const {
  createMediaItem,
  getMediaItemById,
  getAllMediaItems,
  updateMediaItem,
  deleteMediaItem,
} = await import("../../src/services/media.service.js");

// ── Helpers ────────────────────────────────────────────────────────────────────
const fakeId = "550e8400-e29b-41d4-a716-446655440000";

const fakeMediaItem = {
  id: fakeId,
  title: "Test Video",
  description: "A test video",
  media_url: "https://example.com/video.mp4",
  thumbnail_url: "https://example.com/thumb.jpg",
  media_type: "VIDEO" as const,
  userId: fakeId,
  created_at: new Date(),
  updated_at: new Date(),
};

// ── Tests ──────────────────────────────────────────────────────────────────────
describe("Media Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── createMediaItem ──────────────────────────────────────────────────────────
  describe("createMediaItem", () => {
    it("calls prisma.mediaItem.create with the correct fields", async () => {
      mockCreate.mockResolvedValue(fakeMediaItem);

      const input = {
        title: "Test Video",
        description: "A test video",
        media_url: "https://example.com/video.mp4",
        thumbnail_url: "https://example.com/thumb.jpg",
        media_type: "VIDEO" as const,
        userId: fakeId,
      };

      const result = await createMediaItem(input);

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          title: input.title,
          description: input.description,
          media_url: input.media_url,
          thumbnail_url: input.thumbnail_url,
          media_type: input.media_type,
          userId: input.userId,
        },
      });
      expect(result).toEqual(fakeMediaItem);
    });

    it("defaults description and thumbnail_url to null when not provided", async () => {
      mockCreate.mockResolvedValue({ ...fakeMediaItem, description: null, thumbnail_url: null });

      await createMediaItem({
        title: "Image",
        media_url: "https://example.com/img.png",
        media_type: "IMAGE" as const,
        userId: fakeId,
      });

      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ description: null, thumbnail_url: null }),
        }),
      );
    });
  });

  // ── getMediaItemById ─────────────────────────────────────────────────────────
  describe("getMediaItemById", () => {
    it("returns the media item when found", async () => {
      mockFindUnique.mockResolvedValue(fakeMediaItem);

      const result = await getMediaItemById(fakeId);

      expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: fakeId } });
      expect(result).toEqual(fakeMediaItem);
    });

    it("throws AppError 404 when not found", async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(getMediaItemById(fakeId)).rejects.toMatchObject({
        statusCode: 404,
        message: expect.stringContaining(fakeId),
      });
    });
  });

  // ── getAllMediaItems ──────────────────────────────────────────────────────────
  describe("getAllMediaItems", () => {
    it("returns paginated results with correct pagination metadata", async () => {
      mockFindMany.mockResolvedValue([fakeMediaItem]);
      mockCount.mockResolvedValue(1);

      const result = await getAllMediaItems({
        page: 1,
        limit: 10,
        sortBy: "created_at",
        sortOrder: "desc",
      });

      expect(result.data).toEqual([fakeMediaItem]);
      expect(result.pagination).toMatchObject({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });

    it("applies media_type filter to the where clause", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await getAllMediaItems({
        page: 1,
        limit: 10,
        media_type: "IMAGE" as const,
        sortBy: "created_at",
        sortOrder: "desc",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ media_type: "IMAGE" }),
        }),
      );
    });

    it("applies search filter across title and description", async () => {
      mockFindMany.mockResolvedValue([]);
      mockCount.mockResolvedValue(0);

      await getAllMediaItems({
        page: 1,
        limit: 10,
        search: "test",
        sortBy: "created_at",
        sortOrder: "desc",
      });

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ OR: expect.any(Array) }),
        }),
      );
    });
  });

  // ── updateMediaItem ──────────────────────────────────────────────────────────
  describe("updateMediaItem", () => {
    it("updates only provided fields", async () => {
      mockFindUnique.mockResolvedValue(fakeMediaItem);
      mockUpdate.mockResolvedValue({ ...fakeMediaItem, title: "Updated Title" });

      const result = await updateMediaItem(fakeId, { title: "Updated Title" });

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: fakeId },
        data: { title: "Updated Title" },
      });
      expect(result.title).toBe("Updated Title");
    });

    it("throws AppError 404 when updating a non-existent item", async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(
        updateMediaItem(fakeId, { title: "X" }),
      ).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── deleteMediaItem ──────────────────────────────────────────────────────────
  describe("deleteMediaItem", () => {
    it("calls prisma.mediaItem.delete with the correct id", async () => {
      mockFindUnique.mockResolvedValue(fakeMediaItem);
      mockDelete.mockResolvedValue(fakeMediaItem);

      await deleteMediaItem(fakeId);

      expect(mockDelete).toHaveBeenCalledWith({ where: { id: fakeId } });
    });

    it("throws AppError 404 when deleting a non-existent item", async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(deleteMediaItem(fakeId)).rejects.toMatchObject({
        statusCode: 404,
      });
    });
  });
});
