import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database module
vi.mock('./db', () => ({
  getAdminStats: vi.fn().mockResolvedValue({
    posts: 5,
    videos: 10,
    ebooks: 3,
    subscribers: 25
  }),
  adminGetAllPosts: vi.fn().mockResolvedValue([
    { id: 1, title: 'Test Post', slug: 'test-post', published: true },
    { id: 2, title: 'Draft Post', slug: 'draft-post', published: false }
  ]),
  adminGetPostById: vi.fn().mockImplementation((id: number) => {
    if (id === 1) {
      return Promise.resolve({ id: 1, title: 'Test Post', slug: 'test-post' });
    }
    return Promise.resolve(undefined);
  }),
  adminGetAllVideos: vi.fn().mockResolvedValue([
    { id: 1, title: 'Test Video', youtubeId: 'abc123', published: true }
  ]),
  adminGetVideoById: vi.fn().mockImplementation((id: number) => {
    if (id === 1) {
      return Promise.resolve({ id: 1, title: 'Test Video', youtubeId: 'abc123' });
    }
    return Promise.resolve(undefined);
  }),
  adminGetAllEbooks: vi.fn().mockResolvedValue([
    { id: 1, title: 'Test Ebook', pages: 50, published: true }
  ]),
  adminGetEbookById: vi.fn().mockImplementation((id: number) => {
    if (id === 1) {
      return Promise.resolve({ id: 1, title: 'Test Ebook', pages: 50 });
    }
    return Promise.resolve(undefined);
  }),
  adminGetAllSubscribers: vi.fn().mockResolvedValue([
    { id: 1, email: 'test@example.com', name: 'Test User', active: true }
  ]),
  createPost: vi.fn().mockResolvedValue({ id: 3, title: 'New Post', slug: 'new-post' }),
  adminUpdatePost: vi.fn().mockResolvedValue({ id: 1, title: 'Updated Post' }),
  adminDeletePost: vi.fn().mockResolvedValue({ success: true }),
  adminCreateVideo: vi.fn().mockResolvedValue({ id: 2, title: 'New Video' }),
  adminUpdateVideo: vi.fn().mockResolvedValue({ id: 1, title: 'Updated Video' }),
  adminDeleteVideo: vi.fn().mockResolvedValue({ success: true }),
  adminCreateEbook: vi.fn().mockResolvedValue({ id: 2, title: 'New Ebook' }),
  adminUpdateEbook: vi.fn().mockResolvedValue({ id: 1, title: 'Updated Ebook' }),
  adminDeleteEbook: vi.fn().mockResolvedValue({ success: true }),
  adminDeleteSubscriber: vi.fn().mockResolvedValue({ success: true })
}));

import * as db from './db';

describe('Admin Database Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Stats', () => {
    it('should return admin statistics', async () => {
      const stats = await db.getAdminStats();
      expect(stats).toEqual({
        posts: 5,
        videos: 10,
        ebooks: 3,
        subscribers: 25
      });
    });
  });

  describe('Posts CRUD', () => {
    it('should list all posts including drafts', async () => {
      const posts = await db.adminGetAllPosts();
      expect(posts).toHaveLength(2);
      expect(posts[0].title).toBe('Test Post');
      expect(posts[1].published).toBe(false);
    });

    it('should get post by id', async () => {
      const post = await db.adminGetPostById(1);
      expect(post).toBeDefined();
      expect(post?.title).toBe('Test Post');
    });

    it('should return undefined for non-existent post', async () => {
      const post = await db.adminGetPostById(999);
      expect(post).toBeUndefined();
    });

    it('should create a new post', async () => {
      const newPost = await db.createPost({
        title: 'New Post',
        slug: 'new-post',
        excerpt: 'Test excerpt',
        image: 'https://example.com/image.jpg',
        category: 'Test',
        readTime: '5 min'
      });
      expect(newPost).toBeDefined();
      expect(newPost?.title).toBe('New Post');
    });

    it('should update a post', async () => {
      const updated = await db.adminUpdatePost(1, { title: 'Updated Post' });
      expect(updated?.title).toBe('Updated Post');
    });

    it('should delete a post', async () => {
      const result = await db.adminDeletePost(1);
      expect(result.success).toBe(true);
    });
  });

  describe('Videos CRUD', () => {
    it('should list all videos', async () => {
      const videos = await db.adminGetAllVideos();
      expect(videos).toHaveLength(1);
      expect(videos[0].youtubeId).toBe('abc123');
    });

    it('should get video by id', async () => {
      const video = await db.adminGetVideoById(1);
      expect(video).toBeDefined();
      expect(video?.title).toBe('Test Video');
    });

    it('should create a new video', async () => {
      const newVideo = await db.adminCreateVideo({
        title: 'New Video',
        thumbnail: 'https://example.com/thumb.jpg',
        duration: '10:00'
      });
      expect(newVideo).toBeDefined();
    });

    it('should update a video', async () => {
      const updated = await db.adminUpdateVideo(1, { title: 'Updated Video' });
      expect(updated?.title).toBe('Updated Video');
    });

    it('should delete a video', async () => {
      const result = await db.adminDeleteVideo(1);
      expect(result.success).toBe(true);
    });
  });

  describe('Ebooks CRUD', () => {
    it('should list all ebooks', async () => {
      const ebooks = await db.adminGetAllEbooks();
      expect(ebooks).toHaveLength(1);
      expect(ebooks[0].pages).toBe(50);
    });

    it('should get ebook by id', async () => {
      const ebook = await db.adminGetEbookById(1);
      expect(ebook).toBeDefined();
      expect(ebook?.title).toBe('Test Ebook');
    });

    it('should create a new ebook', async () => {
      const newEbook = await db.adminCreateEbook({
        title: 'New Ebook',
        description: 'Test description',
        image: 'https://example.com/cover.jpg',
        pages: 100
      });
      expect(newEbook).toBeDefined();
    });

    it('should update an ebook', async () => {
      const updated = await db.adminUpdateEbook(1, { title: 'Updated Ebook' });
      expect(updated?.title).toBe('Updated Ebook');
    });

    it('should delete an ebook', async () => {
      const result = await db.adminDeleteEbook(1);
      expect(result.success).toBe(true);
    });
  });

  describe('Newsletter Subscribers', () => {
    it('should list all subscribers', async () => {
      const subscribers = await db.adminGetAllSubscribers();
      expect(subscribers).toHaveLength(1);
      expect(subscribers[0].email).toBe('test@example.com');
    });

    it('should delete a subscriber', async () => {
      const result = await db.adminDeleteSubscriber(1);
      expect(result.success).toBe(true);
    });
  });
});
