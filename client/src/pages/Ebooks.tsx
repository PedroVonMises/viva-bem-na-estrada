import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Download, BookOpen, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getEbooks } from "@shared/data";
import { toast } from "sonner";

export default function Ebooks() {
  // Buscar ebooks do banco de dados
  const { data: ebooks, isLoading } = useQuery({ queryKey: ["ebooks"], queryFn: getEbooks });

  const handleDownload = (title: string, downloadUrl: string | null) => {
    if (downloadUrl) {
      toast.info("Redirecionando para página de Download..");
      setTimeout(() => {
        window.open(downloadUrl, "_blank");
      }, 1000);
    } else {
      toast.info(`Download de "${title}" será disponibilizado em breve!`);
    }
  };

  return (
    <Layout>
      <section className="bg-slate-900 py-20 border-b border-slate-800">
        <div className="container text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Materiais <span className="text-primary">Ricos</span>
          </motion.h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Conhecimento aprofundado para levar sua carreira ao próximo nível. Baixe gratuitamente nossos guias exclusivos.
          </p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ebooks?.map((ebook, index) => (
                <motion.div
                  key={ebook.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-primary/50 transition-colors group"
                >
                  <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-colors z-10" />
                    <img 
                      src={ebook.image} 
                      alt={ebook.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                        <BookOpen size={14} />
                        <span>Ebook Gratuito • {ebook.pages} Páginas</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                        {ebook.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        {ebook.description}
                      </p>
                    </div>
                    <Button 
                      onClick={() => handleDownload(ebook.title, ebook.downloadUrl)}
                      className="w-full bg-slate-800 hover:bg-primary text-white border border-slate-700 hover:border-primary transition-all group-hover:shadow-[0_0_15px_rgba(234,88,12,0.3)]"
                    >
                      <Download className="mr-2 h-4 w-4" /> Baixar Agora
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
