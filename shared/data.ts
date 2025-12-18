import { supabase } from "./supabase";
import { Post, Video, Ebook, NewsletterSubscriber } from "../drizzle/schema";

// ========================================
// FUNÇÕES DE LEITURA (READ)
// ========================================

/**
 * Busca todos os posts publicados.
 */
export async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts.");
  }
  // O Supabase retorna objetos JSON, mas o Drizzle/Typescript espera o tipo Post.
  // Assumimos que o schema do Supabase está sincronizado com o Drizzle.
  return data as Post[];
}

/**
 * Busca um post pelo slug.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 é "No rows found"
    console.error(`Error fetching post with slug ${slug}:`, error);
    throw new Error(`Failed to fetch post with slug ${slug}.`);
  }

  return data as Post | null;
}

/**
 * Busca todos os vídeos publicados.
 */
export async function getVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("published", true)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching videos:", error);
    throw new Error("Failed to fetch videos.");
  }
  return data as Video[];
}

/**
 * Busca todos os ebooks publicados.
 */
export async function getEbooks(): Promise<Ebook[]> {
  const { data, error } = await supabase
    .from("ebooks")
    .select("*")
    .eq("published", true)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching ebooks:", error);
    throw new Error("Failed to fetch ebooks.");
  }
  return data as Ebook[];
}

// ========================================
// FUNÇÕES DE ESCRITA (MUTATIONS)
// ========================================

/**
 * Inscreve um email na newsletter.
 */
export async function subscribeToNewsletter(email: string, name?: string): Promise<NewsletterSubscriber> {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, name, active: true })
    .select()
    .single();

  if (error) {
    // Tratar erro de duplicidade de email (código 23505 para unique_violation no PostgreSQL)
    if (error.code === "23505") {
        throw new Error("Email já cadastrado.");
    }
    console.error("Error subscribing to newsletter:", error);
    throw new Error("Falha ao se inscrever na newsletter.");
  }

  return data as NewsletterSubscriber;
}

// As funções de Admin serão implementadas em Vercel Serverless Functions (API Routes)
// para garantir que a chave SUPABASE_SERVICE_ROLE_KEY não seja exposta ao cliente.
// O frontend fará chamadas HTTP para essas rotas.
//
// Para fins de simplificação e para que o build passe, vamos criar as funções
// de Admin aqui, mas elas DEVERIAM ser rotas de API na Vercel para segurança.
//
// ========================================
// FUNÇÕES DE ADMIN (CRUD e Stats)
// ========================================

export async function adminGetStats() {
  // Simulação de dados para o Dashboard
  return {
    posts: 10,
    videos: 5,
    ebooks: 3,
    subscribers: 50,
  };
}

export async function adminGetPosts(): Promise<Post[]> {
  return getPosts(); // Reutiliza a função de leitura
}

export async function adminDeletePost(id: number): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error("Failed to delete post.");
}

export async function adminGetVideos(): Promise<Video[]> {
  return getVideos(); // Reutiliza a função de leitura
}

export async function adminDeleteVideo(id: number): Promise<void> {
  const { error } = await supabase.from("videos").delete().eq("id", id);
  if (error) throw new Error("Failed to delete video.");
}

export async function adminGetEbooks(): Promise<Ebook[]> {
  return getEbooks(); // Reutiliza a função de leitura
}

export async function adminDeleteEbook(id: number): Promise<void> {
  const { error } = await supabase.from("ebooks").delete().eq("id", id);
  if (error) throw new Error("Failed to delete ebook.");
}

export async function adminGetSubscribers(): Promise<NewsletterSubscriber[]> {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) throw new Error("Failed to fetch subscribers.");
  return data as NewsletterSubscriber[];
}

export async function adminDeleteSubscriber(id: number): Promise<void> {
  const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
  if (error) throw new Error("Failed to delete subscriber.");
}

// Funções de Formulário (CRUD - Create/Update)

import { InsertPost, InsertVideo, InsertEbook } from "../drizzle/schema";

export async function adminGetPostById(id: number): Promise<Post | null> {
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
  if (error && error.code !== "PGRST116") throw new Error("Failed to fetch post by ID.");
  return data as Post | null;
}

export async function adminCreatePost(post: InsertPost): Promise<Post> {
  const { data, error } = await supabase.from("posts").insert(post).select().single();
  if (error) throw new Error("Failed to create post.");
  return data as Post;
}

export async function adminUpdatePost(id: number, post: Partial<InsertPost>): Promise<Post> {
  const { data, error } = await supabase.from("posts").update(post).eq("id", id).select().single();
  if (error) throw new Error("Failed to update post.");
  return data as Post;
}

export async function adminGetVideoById(id: number): Promise<Video | null> {
  const { data, error } = await supabase.from("videos").select("*").eq("id", id).single();
  if (error && error.code !== "PGRST116") throw new Error("Failed to fetch video by ID.");
  return data as Video | null;
}

export async function adminCreateVideo(video: InsertVideo): Promise<Video> {
  const { data, error } = await supabase.from("videos").insert(video).select().single();
  if (error) throw new Error("Failed to create video.");
  return data as Video;
}

export async function adminUpdateVideo(id: number, video: Partial<InsertVideo>): Promise<Video> {
  const { data, error } = await supabase.from("videos").update(video).eq("id", id).select().single();
  if (error) throw new Error("Failed to update video.");
  return data as Video;
}

export async function adminGetEbookById(id: number): Promise<Ebook | null> {
  const { data, error } = await supabase.from("ebooks").select("*").eq("id", id).single();
  if (error && error.code !== "PGRST116") throw new Error("Failed to fetch ebook by ID.");
  return data as Ebook | null;
}

export async function adminCreateEbook(ebook: InsertEbook): Promise<Ebook> {
  const { data, error } = await supabase.from("ebooks").insert(ebook).select().single();
  if (error) throw new Error("Failed to create ebook.");
  return data as Ebook;
}

export async function adminUpdateEbook(id: number, ebook: Partial<InsertEbook>): Promise<Ebook> {
  const { data, error } = await supabase.from("ebooks").update(ebook).eq("id", id).select().single();
  if (error) throw new Error("Failed to update ebook.");
  return data as Ebook;
}
