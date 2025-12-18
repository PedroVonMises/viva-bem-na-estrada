import Layout from "@/components/Layout";
import { Facebook, Instagram, Youtube, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Social() {
  const socials = [
    {
      name: "Instagram",
      icon: Instagram,
      color: "from-purple-600 to-pink-600",
      followers: "Siga-nos",
      description: "Bastidores, fotos da estrada e enquetes diárias.",
      link: "https://www.instagram.com/vivabemnaestrada"
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "from-blue-600 to-blue-800",
      followers: "Curta nossa página",
      description: "Comunidade ativa, discussões e compartilhamento de notícias.",
      link: "https://www.facebook.com/profile.php?id=61580852677265"
    },
    {
      name: "YouTube",
      icon: Youtube,
      color: "from-red-600 to-red-700",
      followers: "Inscreva-se",
      description: "Vídeos completos, entrevistas e reportagens especiais.",
      link: "https://www.youtube.com/@vivabemnaestrada"
    }
  ];

  return (
    <Layout>
      <section className="min-h-[80vh] flex flex-col justify-center py-20 bg-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Conecte-se com a <span className="text-primary">Estrada</span>
            </motion.h1>
            <p className="text-lg text-slate-400">
              Siga nossas redes para não perder nenhum conteúdo e fazer parte da maior comunidade de transporte do Brasil.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {socials.map((social, index) => (
              <motion.a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center text-center hover:border-slate-600 transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl`} />
                
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${social.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <social.icon className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{social.name}</h2>
                <span className="text-primary font-bold text-sm mb-4 block">{social.followers}</span>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  {social.description}
                </p>
                
                <div className="mt-auto flex items-center text-white font-medium text-sm bg-slate-800 py-2 px-6 rounded-full group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  Seguir Agora <ExternalLink size={14} className="ml-2" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
