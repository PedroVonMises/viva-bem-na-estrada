import { drizzle } from "drizzle-orm/mysql2";
import { posts, videos, ebooks } from "../drizzle/schema";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL not found");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL);

  console.log("🌱 Seeding database...");

  // Seed Posts
  const postsData = [
    {
      title: "Manutenção Preventiva: O Segredo da Longevidade do Motor",
      slug: "manutencao-preventiva",
      excerpt: "Descubra como pequenas atitudes diárias podem economizar milhares de reais em manutenção e garantir que seu caminhão nunca te deixe na mão.",
      content: "Conteúdo completo do artigo sobre manutenção preventiva...",
      image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=2070&auto=format&fit=crop",
      category: "Mecânica",
      readTime: "5 min",
      published: true,
      featured: true,
    },
    {
      title: "As Melhores Rotas para o Sul do Brasil neste Verão",
      slug: "rotas-sul-brasil",
      excerpt: "Um guia completo com as estradas mais seguras, paradas obrigatórias e paisagens incríveis para quem vai descer para o sul.",
      content: "Conteúdo completo do artigo sobre rotas...",
      image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop",
      category: "Rotas",
      readTime: "8 min",
      published: true,
      featured: true,
    },
    {
      title: "Tecnologia Embarcada: O Futuro da Logística",
      slug: "tecnologia-logistica",
      excerpt: "Como a inteligência artificial e a telemetria estão transformando a vida do motorista profissional e aumentando a segurança nas estradas.",
      content: "Conteúdo completo do artigo sobre tecnologia...",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
      category: "Tecnologia",
      readTime: "6 min",
      published: true,
      featured: true,
    },
  ];

  console.log("📝 Inserting posts...");
  for (const post of postsData) {
    try {
      await db.insert(posts).values(post);
      console.log(`  ✓ Post: ${post.title}`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`  ⏭ Post already exists: ${post.title}`);
      } else {
        throw error;
      }
    }
  }

  // Seed Videos
  const videosData = [
    {
      youtubeId: "dQw4w9WgXcQ",
      title: "Como Economizar Combustível na Serra: Dicas Práticas",
      description: "Neste episódio, Dellano conversa com especialistas em mecânica diesel para desvendar os mitos e verdades sobre a economia de combustível em trechos de serra. Aprenda a usar o freio motor corretamente e poupe até 15% no final do mês.",
      thumbnail: "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?q=80&w=2018&auto=format&fit=crop",
      duration: "12:45",
      published: true,
      featured: true,
    },
    {
      youtubeId: "abc123",
      title: "A Vida na Estrada: Entrevista com Caminhoneiras",
      description: "Conheça histórias inspiradoras de mulheres que escolheram a estrada como profissão.",
      thumbnail: "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?q=80&w=1000&auto=format&fit=crop",
      duration: "15:20",
      published: true,
      featured: false,
    },
    {
      youtubeId: "def456",
      title: "Novas Tecnologias de Rastreamento",
      description: "Descubra as novidades em tecnologia de rastreamento e segurança para frotas.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
      duration: "08:15",
      published: true,
      featured: false,
    },
    {
      youtubeId: "ghi789",
      title: "Cuidados com a Saúde Mental",
      description: "Dicas importantes para manter a saúde mental em dia durante as longas viagens.",
      thumbnail: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop",
      duration: "10:30",
      published: true,
      featured: false,
    },
  ];

  console.log("🎬 Inserting videos...");
  for (const video of videosData) {
    try {
      await db.insert(videos).values(video);
      console.log(`  ✓ Video: ${video.title}`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`  ⏭ Video already exists: ${video.title}`);
      } else {
        throw error;
      }
    }
  }

  // Seed Ebooks
  const ebooksData = [
    {
      title: "Guia Definitivo de Manutenção Preventiva",
      description: "Aprenda a identificar sinais de desgaste antes que eles se tornem problemas caros. Um manual completo para economizar na oficina.",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1000&auto=format&fit=crop",
      downloadUrl: "#",
      pages: 45,
      published: true,
    },
    {
      title: "Saúde na Estrada: Alimentação e Exercícios",
      description: "Dicas práticas para manter a saúde em dia mesmo com a rotina corrida das viagens. Receitas simples e exercícios de cabine.",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop",
      downloadUrl: "#",
      pages: 32,
      published: true,
    },
    {
      title: "Legislação de Trânsito 2025: O Que Mudou?",
      description: "Fique por dentro das novas regras, valores de multas e exigências para o transporte de cargas perigosas e indivisíveis.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop",
      downloadUrl: "#",
      pages: 28,
      published: true,
    },
    {
      title: "Gestão Financeira para Autônomos",
      description: "Planilhas e métodos para calcular frete, lucro real e custos fixos. Transforme seu caminhão em uma empresa rentável.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1000&auto=format&fit=crop",
      downloadUrl: "#",
      pages: 50,
      published: true,
    },
  ];

  console.log("📚 Inserting ebooks...");
  for (const ebook of ebooksData) {
    try {
      await db.insert(ebooks).values(ebook);
      console.log(`  ✓ Ebook: ${ebook.title}`);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`  ⏭ Ebook already exists: ${ebook.title}`);
      } else {
        throw error;
      }
    }
  }

  console.log("\n✅ Seeding completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
