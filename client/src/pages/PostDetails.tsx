import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { getPostBySlug, getPosts } from "@shared/data";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import NotFound from "./NotFound";
import PostCard from "@/components/PostCard"; // Importe o PostCard
import { motion } from "framer-motion"; // Importe o motion

export default function PostDetails() {
  // O slug agora é opcional, pois na rota '/artigos' ele não existirá
  const params = useParams<{ slug?: string }>();
  const isDetailView = !!params.slug;

  // QUERY 1: Busca Post Único (só roda se tiver slug)
  const { data: post, isLoading: isLoadingPost, error: errorPost } = useQuery({
    queryKey: ["post", params.slug],
    queryFn: () => getPostBySlug(params.slug!),
    enabled: isDetailView,
  });

  // QUERY 2: Busca Todos os Posts (só roda se NÃO tiver slug)
  const { data: allPosts, isLoading: isLoadingAll } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    enabled: !isDetailView,
  });

  const isLoading = isDetailView ? isLoadingPost : isLoadingAll;

  // Loading State Geral
  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // --- MODO 1: VISUALIZAÇÃO DE LISTA (TODOS OS POSTS) ---
  if (!isDetailView) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Todos os Artigos
            </h1>
            <p className="text-slate-400 text-lg">
              Explore nossa biblioteca completa de conteúdo sobre segurança, mecânica e vida na estrada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allPosts?.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PostCard 
                  title={p.title}
                  excerpt={p.excerpt}
                  image={p.image}
                  date={new Date(p.createdAt).toLocaleDateString('pt-BR')}
                  readTime={p.readTime}
                  category={p.category}
                  slug={p.slug}
                />
              </motion.div>
            ))}
          </div>

          {allPosts?.length === 0 && (
            <div className="text-center text-slate-500 py-20">
              Nenhum artigo encontrado no momento.
            </div>
          )}
        </div>
      </Layout>
    );
  }

  // --- MODO 2: VISUALIZAÇÃO DE DETALHES (POST ÚNICO) ---
  if (!post || errorPost) {
    return <NotFound />;
  }

  return (
    <Layout>
      {/* Hero Section com Imagem */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        
        <div className="container relative z-20 h-full flex flex-col justify-end pb-12">
          <Link href="/artigos"> {/* Voltar para a lista de artigos agora */}
            <Button variant="ghost" className="text-slate-300 hover:text-white mb-6 pl-0 hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Artigos
            </Button>
          </Link>
          
          <div className="space-y-4 max-w-4xl">
            <Badge className="bg-primary hover:bg-primary/90 text-white border-none px-4 py-1 text-sm uppercase tracking-wider">
              {post.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-slate-300 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <article className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-invert prose-headings:font-bold prose-headings:text-white prose-h1:text-5xl prose-p:text-slate-300 prose-p:mb-8 prose-p:leading-relaxed prose-strong:text-white prose-li:text-slate-300 max-w-none">
            {post.content ? <ReactMarkdown>{post.content}</ReactMarkdown> : <p className="text-slate-400 italic">Sem conteúdo.</p>}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center">
             <Link href="/artigos">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Ver todos os artigos
                </Button>
             </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}