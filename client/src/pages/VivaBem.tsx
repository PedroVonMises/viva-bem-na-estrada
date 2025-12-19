import Layout from "@/components/Layout";
import { Play, Calendar, Clock, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getVideos } from "@shared/data";

export default function VivaBem() {
  // Buscar vídeos do banco de dados
  const { data: latestVideo, isLoading: loadingLatest, error: errorLatest } = useQuery({ queryKey: ["latestVideo"], queryFn: () => getVideos().then(videos => videos[0]) });
  const { data: allVideos, isLoading: loadingAll } = useQuery({ queryKey: ["allVideos"], queryFn: () => getVideos().then(videos => videos.slice(0, 4)) });

  // Filtrar vídeos anteriores (excluindo o mais recente)
  const previousEpisodes = allVideos?.filter(v => v.id !== latestVideo?.id).slice(0, 3) || [];
  // Helper para URL do Youtube
  const getYoutubeUrl = (videoId?: string | null) => {
    if (!videoId) return "#";
    return `https://www.youtube.com/watch?v=${videoId}`;
  };
  // Formatar data para exibição
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const loading = loadingLatest || loadingAll;
  const error = errorLatest;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-slate-900 py-12 border-b border-slate-800">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-primary rounded-full"></div>
            <span className="text-primary font-bold uppercase tracking-widest text-sm">Canal Oficial</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Viva Bem na Estrada</h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Acompanhe nossos episódios semanais com reportagens exclusivas, entrevistas e tudo o que acontece no mundo do transporte.
          </p>
        </div>
      </section>

      {/* Main Video Section */}
      <section className="py-12 bg-background">
        <div className="container">
          {loading ? (
            // Loading State
            <div className="w-full aspect-video bg-slate-900 rounded-2xl animate-pulse flex items-center justify-center">
              <div className="text-slate-600 flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p>Carregando último episódio...</p>
              </div>
            </div>
          ) : error || !latestVideo ? (
            // Error State
            <div className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-red-900/50 p-8 text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Não foi possível carregar o vídeo</h3>
              <p className="text-slate-400 mb-6">Verifique sua conexão ou tente novamente mais tarde.</p>
              <Button onClick={() => window.location.reload()} variant="outline">Tentar Novamente</Button>
            </div>
          ) : (
            // Success State
              <div className="lg:col-span-2">
                {/* BLOCO DO PLAYER DE VÍDEO (IFRAME) */}
                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-slate-800 bg-black">
                  {latestVideo.youtubeId ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${latestVideo.youtubeId}`}
                      title={latestVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    // Fallback caso não tenha ID (mostra apenas a thumbnail)
                    <div className="relative w-full h-full">
                         <img 
                          src={latestVideo.thumbnail} 
                          alt={latestVideo.title} 
                          className="w-full h-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-slate-400 font-medium">Vídeo indisponível</p>
                        </div>
                    </div>
                  )}
                </div>
                
                {/* INFORMAÇÕES DO VÍDEO */}
                <div className="mt-8">
                  <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} className="text-primary" />
                      {/* ATENÇÃO: Se você atualizou o banco para 'created_at', use .created_at aqui. 
                          Se ainda não atualizou, mantenha .createdAt */}
                      <span>{formatDate(latestVideo.created_at || latestVideo.createdAt)}</span>
                    </div>
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <span className="flex items-center gap-1 text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded-full text-xs">
                      YouTube Oficial
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {latestVideo.title}
                  </h2>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {latestVideo.description}
                  </p>
                </div>
              </div>)

              {/* Sidebar List */}
              <div className="lg:col-span-1">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Clock className="text-primary" size={20} />
                  Episódios Anteriores
                </h3>
                <div className="flex flex-col gap-4">
                  {previousEpisodes.map((video) => (
                    <a
                      key={video.id}
                      href={getYoutubeUrl(video.youtubeId)}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="flex gap-4 group cursor-pointer p-3 rounded-xl hover:bg-slate-900 transition-colors"
                    >
                      <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-white font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1">
                          {video.title}
                        </h4>
                        <span className="text-slate-500 text-xs">{formatDate(video.createdAt)}</span>
                      </div>
                    </a>
                  ))}}
                  
                  <Button variant="outline" className="w-full mt-4 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
                    Ver Canal Completo
                  </Button>
                </div>
              </div>
            </div>
          )
        </div>
      </section>
    </Layout>
  ;

