import { eq, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  posts, InsertPost, Post,
  videos, InsertVideo, Video,
  ebooks, InsertEbook, Ebook,
  newsletterSubscribers, InsertNewsletterSubscriber 
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========================================
// POSTS / ARTIGOS - PUBLIC
// ========================================

export async function getAllPosts(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const query = db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.createdAt));
  if (limit) {
    return query.limit(limit);
  }
  return query;
}

export async function getFeaturedPosts(limit = 3) {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .limit(limit);
}

export async function getPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPost(post: InsertPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(posts).values(post);
  return getPostBySlug(post.slug);
}

// ========================================
// VÍDEOS - PUBLIC
// ========================================

export async function getAllVideos(limit?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const query = db.select().from(videos).where(eq(videos.published, true)).orderBy(desc(videos.createdAt));
  if (limit) {
    return query.limit(limit);
  }
  return query;
}

export async function getLatestVideo() {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(videos)
    .where(eq(videos.published, true))
    .orderBy(desc(videos.createdAt))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createVideo(video: InsertVideo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(videos).values(video);
  return result;
}

// ========================================
// EBOOKS - PUBLIC
// ========================================

export async function getAllEbooks() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(ebooks).where(eq(ebooks.published, true)).orderBy(desc(ebooks.createdAt));
}

export async function createEbook(ebook: InsertEbook) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(ebooks).values(ebook);
}

// ========================================
// NEWSLETTER - PUBLIC
// ========================================

export async function subscribeToNewsletter(email: string, name?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    await db.insert(newsletterSubscribers).values({ email, name: name ?? null });
    return { success: true };
  } catch (error: any) {
    // Duplicate email
    if (error.code === 'ER_DUP_ENTRY') {
      return { success: false, error: "Este e-mail já está inscrito." };
    }
    throw error;
  }
}

export async function getNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.active, true));
}

// ========================================
// ADMIN - POSTS CRUD
// ========================================

export async function adminGetAllPosts() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(posts).orderBy(desc(posts.createdAt));
}

export async function adminGetPostById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function adminUpdatePost(id: number, data: Partial<InsertPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(posts).set(data).where(eq(posts.id, id));
  return adminGetPostById(id);
}

export async function adminDeletePost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(posts).where(eq(posts.id, id));
  return { success: true };
}

// ========================================
// ADMIN - VIDEOS CRUD
// ========================================

export async function adminGetAllVideos() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(videos).orderBy(desc(videos.createdAt));
}

export async function adminGetVideoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function adminCreateVideo(video: InsertVideo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(videos).values(video);
  // Get the inserted ID from the result
  const insertId = (result as any)[0]?.insertId;
  if (insertId) {
    return adminGetVideoById(insertId);
  }
  return null;
}

export async function adminUpdateVideo(id: number, data: Partial<InsertVideo>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(videos).set(data).where(eq(videos.id, id));
  return adminGetVideoById(id);
}

export async function adminDeleteVideo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(videos).where(eq(videos.id, id));
  return { success: true };
}

// ========================================
// ADMIN - EBOOKS CRUD
// ========================================

export async function adminGetAllEbooks() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(ebooks).orderBy(desc(ebooks.createdAt));
}

export async function adminGetEbookById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(ebooks).where(eq(ebooks.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function adminCreateEbook(ebook: InsertEbook) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(ebooks).values(ebook);
  const insertId = (result as any)[0]?.insertId;
  if (insertId) {
    return adminGetEbookById(insertId);
  }
  return null;
}

export async function adminUpdateEbook(id: number, data: Partial<InsertEbook>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(ebooks).set(data).where(eq(ebooks.id, id));
  return adminGetEbookById(id);
}

export async function adminDeleteEbook(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(ebooks).where(eq(ebooks.id, id));
  return { success: true };
}

// ========================================
// ADMIN - NEWSLETTER
// ========================================

export async function adminGetAllSubscribers() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt));
}

export async function adminDeleteSubscriber(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id));
  return { success: true };
}

// ========================================
// ADMIN - STATISTICS
// ========================================

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { posts: 0, videos: 0, ebooks: 0, subscribers: 0 };
  
  const [postsCount] = await db.select({ count: sql<number>`count(*)` }).from(posts);
  const [videosCount] = await db.select({ count: sql<number>`count(*)` }).from(videos);
  const [ebooksCount] = await db.select({ count: sql<number>`count(*)` }).from(ebooks);
  const [subscribersCount] = await db.select({ count: sql<number>`count(*)` }).from(newsletterSubscribers).where(eq(newsletterSubscribers.active, true));
  
  return {
    posts: Number(postsCount?.count ?? 0),
    videos: Number(videosCount?.count ?? 0),
    ebooks: Number(ebooksCount?.count ?? 0),
    subscribers: Number(subscribersCount?.count ?? 0),
  };
}
