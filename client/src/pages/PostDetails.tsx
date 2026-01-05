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
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {/* Camadas de fundo (Overlay) */}
        <div className="absolute inset-0 bg-slate-950/70 z-10" /> 
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent z-10" />
        
        {/* Imagem de fundo */}
        <img 
            src={post.image} 
            alt={post.title} 
            className="h-full w-full object-cover" 
        />
        
        {/* Conteúdo Centralizado */}
        <div className="absolute inset-0 z-20 container flex flex-col items-center justify-end pb-16">
          
          {/* Botão de Voltar (Centralizado no topo da área de conteúdo ou acima do título) */}
          <Link href="/artigos">
            <Button variant="ghost" className="text-slate-300 hover:text-white mb-8 hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Artigos
            </Button>
          </Link>
          
          {/* Wrapper do Texto (Centralizado) */}
          <div className="space-y-6 max-w-5xl mx-auto text-center flex flex-col items-center">
            
            {/* Categoria */}
            <Badge className="bg-primary hover:bg-primary/90 text-white border-none px-6 py-1.5 text-base uppercase tracking-wider mb-2">
              {post.category}
            </Badge>

            {/* TÍTULO DA CÉLULA 'TITLE' DO SUPABASE - AGORA GIGANTE E CENTRALIZADO */}
            <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
              {post.title}
            </h1>

            {/* Metadados (Data e Tempo) */}
            <div className="flex items-center justify-center gap-8 text-slate-200 text-base md:text-lg font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Corpo do Texto */}
      <article className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Aqui removemos as classes de título H1 da div prose, pois o título já está no banner */}
          <div className="prose prose-lg prose-invert prose-p:text-slate-300 prose-p:mb-8 prose-p:leading-relaxed prose-strong:text-white prose-li:text-slate-300 max-w-none">
            {post.content ? <ReactMarkdown>{post.content}</ReactMarkdown> : <p className="text-slate-400 italic">Sem conteúdo.</p>}
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 flex justify-center items-center">
             <Link href="/artigos">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Ler outros artigos
                </Button>
             </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}