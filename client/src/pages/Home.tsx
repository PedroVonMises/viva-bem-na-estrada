import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Layout from "@/components/Layout";
import PostCard from "@/components/PostCard";
import { ArrowRight, Mail, Loader2, X, Link } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getPosts, subscribeToNewsletter } from "@shared/data";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [showIntroVideo, setShowIntroVideo] = useState(true);
  const [email, setEmail] = useState("");
  
  // Buscar posts do banco de dados
  const { data: featuredPosts, isLoading } = useQuery({ queryKey: ["featuredPosts"], queryFn: () => getPosts().then(posts => posts.filter(p => p.featured).slice(0, 3)) });
  
  // Mutation para newsletter
  const newsletterMutation = useMutation({ mutationFn: (data: { email: string, name?: string }) => subscribeToNewsletter(data.email, data.name),
    onSuccess: (data) => {
      if (data) {
        toast.success("Inscrição realizada com sucesso!");
        setEmail("");
      } else {

      }
    },
onError: (error: Error) => {
    toast.error(error.message || "Erro ao realizar inscrição. Tente novamente.");
  }
});

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      newsletterMutation.mutate({ email });
    }
  };

  // Formatar data para exibição
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      {/* --- VÍDEO INTRO (FULLSCREEN OVERLAY) --- */}
      {showIntroVideo && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-500">
          <button 
            onClick={() => setShowIntroVideo(false)}
            className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110"
            title="Fechar vídeo"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <AspectRatio ratio={16 / 9} className="w-full max-h-screen">
              <iframe
                // autoplay=1 e mute=1 são essenciais para funcionar automático
                src="https://www.youtube.com/embed/Sid1Puxgymk?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&showinfo=0&si=T9FmyB2vqM1WaPgy" 
                title="Vídeo Institucional Viva Bem na Estrada"
                className="w-full h-full rounded-lg shadow-2xl border border-white/10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </AspectRatio>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-950/70 z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop" 
            alt="Highway at night" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="container relative z-20 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/50 text-primary text-sm font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              O Portal do Motorista Profissional
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Informação que <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Viaja com Você</span>
            </h1>
            
            {/* Vídeo Inline (Fica na página após fechar o intro) */}
            <div className="w-full max-w-3xl mx-auto mb-10 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-700/50 bg-slate-950">
              <AspectRatio ratio={16 / 9}>
                <iframe
                  src="https://www.youtube.com/embed/Sid1Puxgymk?si=T9FmyB2vqM1WaPgy" 
                  title="Vídeo Institucional Viva Bem na Estrada"
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </AspectRatio>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 rounded-lg font-bold shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all hover:scale-105">
                Baixe nossos Ebooks
              </Button>
              <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-800 hover:text-white text-lg px-8 py-6 rounded-lg font-bold backdrop-blur-sm transition-all">
                Ver Últimos Artigos
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Destaques da Semana</h2>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 hidden md:flex">
              Ver todos os posts <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPosts?.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostCard 
                    title={post.title}
                    excerpt={post.excerpt}
                    image={post.image}
                    date={formatDate(post.createdAt)}
                    readTime={post.readTime}
                    category={post.category}
                    slug={post.slug}
                  />
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 w-full">
              Ver todos os posts <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-20 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary to-transparent" />
        </div>
        
        <div className="container relative z-10">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 shadow-2xl">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center p-3 bg-primary/20 rounded-xl mb-6">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Não perca nenhuma novidade</h2>
              <p className="text-slate-400 text-lg">
                Junte-se a mais de 15.000 motoristas e receba semanalmente dicas exclusivas, alertas de rotas e conteúdo premium diretamente no seu e-mail.
              </p>
            </div>
            
            <div className="w-full md:w-auto md:min-w-[400px]">
              <form className="flex flex-col gap-4" onSubmit={handleNewsletterSubmit}>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm font-medium text-slate-300 ml-1">Seu melhor e-mail</label>
                  <input 
                    type="email" 
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="joao.silva@exemplo.com" 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    required
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={newsletterMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg shadow-lg"
                >
                  {newsletterMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inscrevendo...</>
                  ) : (
                    "Inscrever-se Gratuitamente"
                  )}
                </Button>
                <p className="text-xs text-slate-500 text-center mt-2">
                  Respeitamos sua privacidade. Cancele quando quiser.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}