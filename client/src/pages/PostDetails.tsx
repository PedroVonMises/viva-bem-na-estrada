import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { getPostBySlug } from "@shared/data";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Clock, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown"; // Requer pnpm add react-markdown
import NotFound from "./NotFound";

export default function PostDetails() {
  const params = useParams<{ slug: string }>();
  
  // Busca o post usando o slug da URL
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", params.slug],
    queryFn: () => getPostBySlug(params.slug!),
    enabled: !!params.slug,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  // Se não encontrar o post ou der erro, exibe 404
  if (!post || error) {
    return <NotFound />;
  }

  return (
    <Layout>
      {/* Hero Section com Imagem de Fundo */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/60 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
        <img 
          src={post.image} 
          alt={post.title} 
          className="h-full w-full object-cover"
        />
        
        <div className="container relative z-20 h-full flex flex-col justify-end pb-12">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white mb-6 pl-0 hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Home
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

      {/* Conteúdo do Artigo */}
      <article className="container py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* A classe 'prose' vem do plugin @tailwindcss/typography.
            'prose-invert' ajusta as cores para o tema escuro.
          */}
          <div className="prose prose-lg prose-invert prose-headings:font-bold prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white prose-li:text-slate-300 max-w-none">
            {post.content ? (
              <ReactMarkdown>{post.content}</ReactMarkdown>
            ) : (
              <p className="text-slate-400 italic">Este post não possui conteúdo textual.</p>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800 flex justify-between items-center">
             <Link href="/">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Ver mais artigos
                </Button>
             </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
}