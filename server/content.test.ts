import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  getAllPosts: vi.fn(),
  getFeaturedPosts: vi.fn(),
  getPostBySlug: vi.fn(),
  getAllVideos: vi.fn(),
  getLatestVideo: vi.fn(),
  getAllEbooks: vi.fn(),
  subscribeToNewsletter: vi.fn(),
}));

import * as db from "./db";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("posts router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns featured posts", async () => {
    const mockPosts = [
      { id: 1, title: "Test Post", slug: "test-post", excerpt: "Test", image: "test.jpg", category: "Test", readTime: "5 min", published: true, featured: true, createdAt: new Date(), updatedAt: new Date() },
    ];
    
    vi.mocked(db.getFeaturedPosts).mockResolvedValue(mockPosts);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.posts.featured({ limit: 3 });
    
    expect(result).toEqual(mockPosts);
    expect(db.getFeaturedPosts).toHaveBeenCalledWith(3);
  });

  it("returns post by slug", async () => {
    const mockPost = { id: 1, title: "Test Post", slug: "test-post", excerpt: "Test", image: "test.jpg", category: "Test", readTime: "5 min", published: true, featured: true, createdAt: new Date(), updatedAt: new Date(), content: "Full content" };
    
    vi.mocked(db.getPostBySlug).mockResolvedValue(mockPost);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.posts.bySlug({ slug: "test-post" });
    
    expect(result).toEqual(mockPost);
    expect(db.getPostBySlug).toHaveBeenCalledWith("test-post");
  });
});

describe("videos router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns latest video", async () => {
    const mockVideo = { id: 1, youtubeId: "abc123", title: "Test Video", description: "Test", thumbnail: "test.jpg", duration: "10:00", published: true, featured: true, createdAt: new Date(), updatedAt: new Date() };
    
    vi.mocked(db.getLatestVideo).mockResolvedValue(mockVideo);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.videos.latest();
    
    expect(result).toEqual(mockVideo);
    expect(db.getLatestVideo).toHaveBeenCalled();
  });

  it("returns all videos with limit", async () => {
    const mockVideos = [
      { id: 1, youtubeId: "abc123", title: "Video 1", description: "Test", thumbnail: "test.jpg", duration: "10:00", published: true, featured: true, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, youtubeId: "def456", title: "Video 2", description: "Test", thumbnail: "test.jpg", duration: "15:00", published: true, featured: false, createdAt: new Date(), updatedAt: new Date() },
    ];
    
    vi.mocked(db.getAllVideos).mockResolvedValue(mockVideos);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.videos.list({ limit: 5 });
    
    expect(result).toEqual(mockVideos);
    expect(db.getAllVideos).toHaveBeenCalledWith(5);
  });
});

describe("ebooks router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all ebooks", async () => {
    const mockEbooks = [
      { id: 1, title: "Test Ebook", description: "Test", image: "test.jpg", downloadUrl: "#", pages: 50, published: true, createdAt: new Date(), updatedAt: new Date() },
    ];
    
    vi.mocked(db.getAllEbooks).mockResolvedValue(mockEbooks);
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.ebooks.list();
    
    expect(result).toEqual(mockEbooks);
    expect(db.getAllEbooks).toHaveBeenCalled();
  });
});

describe("newsletter router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("subscribes new email successfully", async () => {
    vi.mocked(db.subscribeToNewsletter).mockResolvedValue({ success: true });
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.newsletter.subscribe({ email: "test@example.com" });
    
    expect(result).toEqual({ success: true });
    expect(db.subscribeToNewsletter).toHaveBeenCalledWith("test@example.com", undefined);
  });

  it("handles duplicate email", async () => {
    vi.mocked(db.subscribeToNewsletter).mockResolvedValue({ success: false, error: "Este e-mail já está inscrito." });
    
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    
    const result = await caller.newsletter.subscribe({ email: "existing@example.com" });
    
    expect(result).toEqual({ success: false, error: "Este e-mail já está inscrito." });
  });
});
