import { jest, describe, it, beforeEach, expect } from '@jest/globals';
import { AppError } from "../../src/utils/appError.js";
import { ScopeArea } from "../../src/generated/prisma/enums.js";

const mockFindUnique = jest.fn();
jest.unstable_mockModule("../../src/models/prisma.js", () => ({
  default: {
    adminScope: {
      findUnique: mockFindUnique,
    },
  },
}));

const { requireScopeAccess } = await import("../../src/middlewares/scopeAccess.middleware.js");
const prisma = (await import("../../src/models/prisma.js")).default;

describe("scopeAccess middleware", () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = { user: null };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should block unauthenticated requests", async () => {
    const middleware = requireScopeAccess(ScopeArea.EVENTS);
    await middleware(req, res, next);
    
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(401);
  });

  it("should allow ADMIN full access without checking DB", async () => {
    req.user = { userId: "admin-id", role: "ADMIN" };
    
    const middleware = requireScopeAccess(ScopeArea.EVENTS);
    await middleware(req, res, next);
    
    expect(prisma.adminScope.findUnique).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(); // Next called with no errors
  });

  it("should allow SUB_ADMIN access if scope row exists", async () => {
    req.user = { userId: "subadmin-id", role: "SUB_ADMIN" };
    (prisma.adminScope.findUnique as jest.Mock).mockResolvedValue({ id: "scope-1" });
    
    const middleware = requireScopeAccess(ScopeArea.EVENTS);
    await middleware(req, res, next);
    
    expect(prisma.adminScope.findUnique).toHaveBeenCalledWith({
      where: {
        admin_user_id_scope_area: {
          admin_user_id: "subadmin-id",
          scope_area: ScopeArea.EVENTS,
        }
      }
    });
    expect(next).toHaveBeenCalledWith(); 
  });

  it("should deny SUB_ADMIN access if scope row does not exist", async () => {
    req.user = { userId: "subadmin-id", role: "SUB_ADMIN" };
    (prisma.adminScope.findUnique as jest.Mock).mockResolvedValue(null);
    
    const middleware = requireScopeAccess(ScopeArea.GALLERY);
    await middleware(req, res, next);
    
    expect(prisma.adminScope.findUnique).toHaveBeenCalledWith({
      where: {
        admin_user_id_scope_area: {
          admin_user_id: "subadmin-id",
          scope_area: ScopeArea.GALLERY,
        }
      }
    });
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });

  it("should block access if user role is neither ADMIN nor SUB_ADMIN", async () => {
    req.user = { userId: "user-id", role: "USER" };
    
    const middleware = requireScopeAccess(ScopeArea.EVENTS);
    await middleware(req, res, next);
    
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0].statusCode).toBe(403);
  });
});
