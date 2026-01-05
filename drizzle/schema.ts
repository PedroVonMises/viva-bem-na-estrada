import { pgTable, serial, text, varchar, boolean, timestamp, integer } from "drizzle-orm/pg-core";

// ========================================
// TABELAS DO BLOG VIVA BEM NA ESTRADA
// ========================================

/**
 * Tabela de Posts/Artigos do Blog
 */
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  image: varchar("image", { length: 512 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  readTime: varchar("readTime", { length: 20 }).notNull(),
  published: boolean("published").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Tabela de Vídeos do Canal
 */
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  youtubeId: varchar("youtubeId", { length: 50 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  thumbnail: varchar("thumbnail", { length: 512 }).notNull(),
  duration: varchar("duration", { length: 20 }).notNull(),
  published: boolean("published").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Tabela de Ebooks/Materiais Ricos
 */
export const ebooks = pgTable("ebooks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 512 }).notNull(),
  downloadUrl: varchar("downloadUrl", { length: 512 }),
  pages: integer("pages").notNull(), // Alterado para serial, assumindo que é um contador
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Ebook = typeof ebooks.$inferSelect;
export type InsertEbook = typeof ebooks.$inferInsert;

/**
 * Tabela de Inscritos na Newsletter
 */
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
