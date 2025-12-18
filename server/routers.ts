import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, adminProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

// Schemas de validação
const postSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  excerpt: z.string().min(1, "Resumo é obrigatório"),
  content: z.string().optional(),
  image: z.string().url("URL da imagem inválida"),
  category: z.string().min(1, "Categoria é obrigatória"),
  readTime: z.string().min(1, "Tempo de leitura é obrigatório"),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

const videoSchema = z.object({
  youtubeId: z.string().optional(),
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().optional(),
  thumbnail: z.string().url("URL da thumbnail inválida"),
  duration: z.string().min(1, "Duração é obrigatória"),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
});

const ebookSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  image: z.string().url("URL da imagem inválida"),
  downloadUrl: z.string().optional(),
  pages: z.number().min(1, "Número de páginas é obrigatório"),
  published: z.boolean().optional(),
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========================================
  // POSTS / ARTIGOS - PUBLIC
  // ========================================
  posts: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getAllPosts(input?.limit);
      }),
    
    featured: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getFeaturedPosts(input?.limit ?? 3);
      }),
    
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getPostBySlug(input.slug);
      }),
  }),

  // ========================================
  // VÍDEOS - PUBLIC
  // ========================================
  videos: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ input }) => {
        return db.getAllVideos(input?.limit);
      }),
    
    latest: publicProcedure.query(async () => {
      return db.getLatestVideo();
    }),
  }),

  // ========================================
  // EBOOKS - PUBLIC
  // ========================================
  ebooks: router({
    list: publicProcedure.query(async () => {
      return db.getAllEbooks();
    }),
  }),

  // ========================================
  // NEWSLETTER - PUBLIC
  // ========================================
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({ 
        email: z.string().email("E-mail inválido"),
        name: z.string().optional()
      }))
      .mutation(async ({ input }) => {
        return db.subscribeToNewsletter(input.email, input.name);
      }),
  }),

  // ========================================
  // ADMIN - DASHBOARD
  // ========================================
  admin: router({
    stats: adminProcedure.query(async () => {
      return db.getAdminStats();
    }),

    // POSTS CRUD
    posts: router({
      list: adminProcedure.query(async () => {
        return db.adminGetAllPosts();
      }),
      
      byId: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return db.adminGetPostById(input.id);
        }),
      
      create: adminProcedure
        .input(postSchema)
        .mutation(async ({ input }) => {
          return db.createPost(input);
        }),
      
      update: adminProcedure
        .input(z.object({ id: z.number(), data: postSchema.partial() }))
        .mutation(async ({ input }) => {
          return db.adminUpdatePost(input.id, input.data);
        }),
      
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.adminDeletePost(input.id);
        }),
    }),

    // VIDEOS CRUD
    videos: router({
      list: adminProcedure.query(async () => {
        return db.adminGetAllVideos();
      }),
      
      byId: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return db.adminGetVideoById(input.id);
        }),
      
      create: adminProcedure
        .input(videoSchema)
        .mutation(async ({ input }) => {
          return db.adminCreateVideo(input);
        }),
      
      update: adminProcedure
        .input(z.object({ id: z.number(), data: videoSchema.partial() }))
        .mutation(async ({ input }) => {
          return db.adminUpdateVideo(input.id, input.data);
        }),
      
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.adminDeleteVideo(input.id);
        }),
    }),

    // EBOOKS CRUD
    ebooks: router({
      list: adminProcedure.query(async () => {
        return db.adminGetAllEbooks();
      }),
      
      byId: adminProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
          return db.adminGetEbookById(input.id);
        }),
      
      create: adminProcedure
        .input(ebookSchema)
        .mutation(async ({ input }) => {
          return db.adminCreateEbook(input);
        }),
      
      update: adminProcedure
        .input(z.object({ id: z.number(), data: ebookSchema.partial() }))
        .mutation(async ({ input }) => {
          return db.adminUpdateEbook(input.id, input.data);
        }),
      
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.adminDeleteEbook(input.id);
        }),
    }),

    // NEWSLETTER SUBSCRIBERS
    subscribers: router({
      list: adminProcedure.query(async () => {
        return db.adminGetAllSubscribers();
      }),
      
      delete: adminProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
          return db.adminDeleteSubscriber(input.id);
        }),
    }),
  }),
});

export type AppRouter = typeof appRouter;
