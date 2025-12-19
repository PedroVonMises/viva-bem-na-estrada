import Layout from "@/components/Layout";
import { Book, Download, Loader2, AlertCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getEbooks } from "@shared/data";

export default function Ebooks() {
  const { data: ebooks, isLoading, error } = useQuery({
    queryKey: ["ebooks"],
    queryFn: getEbooks
  });

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "Data desconhecida";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-slate-900 py-12 border-b border-slate-800">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-primary rounded-full"></div>
            <span className="text-primary font-bold uppercase tracking-widest text-sm">Materiais Ricos</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Ebooks Gratuitos</h1>
          <p className="text-slate-400 max-w-2xl text-lg">
            Aprofunde seus conhecimentos com nossos guias completos e manuais exclusivos para profissionais da estrada.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
              <p>Carregando materiais...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-500 border border-red-900/20 bg-red-900/10 rounded-2xl">
              <AlertCircle className="h-12 w-12 mb-4" />
              <p className="font-medium text-lg">Erro ao carregar ebooks.</p>
              <Button variant="link" onClick={() => window.location.reload()} className="mt-2 text-red-400">
                Tentar novamente
              </Button>
            </div>
          ) : ebooks && ebooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ebooks.map((ebook) => (
                <div key={ebook.id} className="group bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden bg-slate-200">
                    {ebook.image ? (
                      <img 
                        src={ebook.image} 
                        alt={ebook.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <Book size={64} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1">
                      <FileText size={12} className="text-primary" />
                      {ebook.pages ? `${ebook.pages} Páginas` : 'PDF Completo'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-xs text-primary font-bold tracking-wider mb-2 uppercase">
                      Guia Prático
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                      {ebook.title}
                    </h3>
                    <p className="text-slate-600 mb-6 line-clamp-3 flex-grow">
                      {ebook.description}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-400 text-xs font-medium">
                        {/* Usando createdAt conforme sua configuração */}
                        {formatDate(ebook.createdAt)}
                      </span>
                      
                      <a 
                        href={ebook.downloadUrl || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button className="gap-2 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                          <Download size={16} />
                          Baixar Grátis
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
              <Book className="h-16 w-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">Nenhum material disponível</h3>
              <p className="text-slate-500 mt-2">Em breve novos ebooks gratuitos para você.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}