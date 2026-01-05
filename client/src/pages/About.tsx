import Layout from "@/components/Layout";
import { motion } from "framer-motion";

export default function About() {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-slate-900 py-20 border-b border-slate-800">
        <div className="container text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Sobre o <span className="text-primary">Viva Bem na Estrada</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 leading-relaxed"
          >
            Mais do que um blog, somos uma comunidade dedicada a melhorar a vida de quem movimenta o Brasil.
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container">
          {/* Block 1: Dellano */}
          <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <div className="absolute inset-0 bg-primary/10 z-10 mix-blend-overlay" />
                <img 
                  src="/dellano.png" 
                  alt="Apresentador Dellano" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
                A Voz da Estrada
              </h2>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Liderado pelo apresentador <strong>Dellano</strong>, referência em jornalismo rodoviário, o projeto nasceu da necessidade de trazer informação de qualidade, sem filtros, para o motorista profissional.
              </p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Com décadas de experiência cobrindo o setor de transportes, Dellano conhece as dores, as alegrias e os desafios de quem vive na boleia. Sua missão é clara: valorizar o profissional e oferecer ferramentas para uma vida mais segura e próspera.
              </p>
            </motion.div>
          </div>

          {/* Block 2: Viva Bem Comunicação */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <div className="absolute inset-0 bg-primary/10 z-10 mix-blend-overlay" />
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop" 
                  alt="Equipe Viva Bem Comunicação" 
                  className="w-full h-auto object-cover aspect-[4/3]"
                />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
                Viva Bem Comunicação
              </h2>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Por trás do blog existe a <strong>Viva Bem Comunicação</strong>, uma agência especializada no setor de transporte e logística. Nossa equipe respira diesel e entende a linguagem da estrada.
              </p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Produzimos conteúdo multimídia, eventos e consultoria para grandes marcas que desejam se conectar verdadeiramente com o público caminhoneiro. Não somos apenas observadores; somos parceiros de jornada.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
