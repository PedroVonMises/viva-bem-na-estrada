# 🚛 Blog Viva Bem na Estrada

**Viva Bem na Estrada** é uma plataforma moderna dedicada a fornecer informação, segurança e entretenimento para motoristas profissionais. O projeto foi desenvolvido como uma Single Page Application (SPA) de alta performance, totalmente responsiva e construída sobre uma arquitetura **Serverless**, garantindo escalabilidade e facilidade de manutenção.

**🌐 Site oficial:** [https://vivabemnaestrada.com](https://vivabemnaestrada.com)

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue) ![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Tecnologias e Arquitetura

Este projeto utiliza uma stack moderna focada em experiência do usuário (UX) e eficiência de desenvolvimento:

### Frontend (Client)
- **[React](https://react.dev/)**: Biblioteca UI principal.
- **[Vite](https://vitejs.dev/)**: Build tool e ambiente de desenvolvimento ultrarrápido.
- **[Tailwind CSS](https://tailwindcss.com/)**: Framework de estilização utility-first para design responsivo.
- **[shadcn/ui](https://ui.shadcn.com/)**: Componentes de interface acessíveis e elegantes.
- **[wouter](https://github.com/molefrog/wouter)**: Roteamento leve e minimalista.
- **[TanStack Query](https://tanstack.com/query/latest)**: Gerenciamento de estado assíncrono e cache.

### Backend & Dados (Serverless)
- **[Supabase](https://supabase.com/)**: Backend-as-a-Service (BaaS) para autenticação e banco de dados Postgres.
- **[Drizzle ORM](https://orm.drizzle.team/)**: ORM TypeScript-first para interação segura com o banco de dados.

## 🖼️ Design Responsivo

A aplicação foi projetada com o conceito *Mobile First*. O uso do Tailwind CSS permite que o layout se adapte fluidamente a qualquer tamanho de tela, garantindo acessibilidade tanto em smartphones (usados na estrada) quanto em desktops (painel administrativo).

## 📂 Estrutura do Projeto

A organização do código separa claramente as responsabilidades do frontend, código compartilhado e configuração de banco de dados:

```
viva-bem-na-estrada/
├── client/                 # Aplicação Frontend (SPA)
│   ├── public/             # Assets estáticos (logos, imagens)
│   ├── src/
│   │   ├── _core/          # Lógica central e hooks de autenticação
│   │   ├── components/     # Componentes React (UI e Funcionais)
│   │   ├── contexts/       # Contextos globais (Tema, Auth)
│   │   ├── hooks/          # Custom Hooks (useMobile, etc)
│   │   ├── lib/            # Utilitários gerais
│   │   ├── pages/          # Páginas (Home, Admin, Ebooks)
│   │   ├── App.tsx         # Root component e Rotas
│   │   └── main.tsx        # Entry point
│   └── index.html          # Template HTML principal
├── shared/                 # Código compartilhado (Types, Consts, Supabase Client)
├── drizzle/                # Migrações SQL e Schemas do Banco
├── tailwind.config.ts      # Configuração de estilos e temas
├── vite.config.ts          # Configuração do Vite (Paths e Plugins)
└── package.json            # Dependências e Scripts
```
## 🎨 Design System

### Cores
- **Background:** #0a1628 (Deep Navy)
- **Acentos:** #ea580c (Laranja Vibrante)
- **Texto:** #ffffff (Branco)
- **Bordas:** Tracejadas (dashed) em verde, laranja, amarelo

### Tipografia
- **Fonte:** Inter (400, 500, 600, 700, 800, 900)
- **Hero:** 4xl-5xl, negrito
- **Títulos:** 2xl-3xl, negrito
- **Corpo:** base-lg, regular

## 🗄️ Banco de Dados

### Tabelas

**posts**
- id, title, excerpt, content, image, category, published_at, created_at, updated_at

**videos**
- id, title, youtube_id, thumbnail, duration, description, created_at, updated_at

**ebooks**
- id, title, description, image, pages, download_url, created_at, updated_at

**newsletter_subscribers**
- id, email, subscribed_at

## 📱 Páginas

### Públicas
- `/` - Home com hero section e últimos posts
- `/viva-bem` - Vídeos do canal YouTube
- `/sobre` - Sobre o apresentador e equipe
- `/ebooks` - Materiais gratuitos para download
- `/social` - Links das redes sociais

### Administrativas (requer login)
- `/admin` - Dashboard com estatísticas
- `/admin/posts` - Gerenciar posts
- `/admin/posts/new` - Criar novo post
- `/admin/posts/:id/edit` - Editar post
- `/admin/videos` - Gerenciar vídeos
- `/admin/videos/new` - Adicionar vídeo
- `/admin/videos/:id/edit` - Editar vídeo
- `/admin/ebooks` - Gerenciar ebooks
- `/admin/ebooks/new` - Adicionar ebook
- `/admin/ebooks/:id/edit` - Editar ebook
- `/admin/newsletter` - Lista de inscritos

## 🧪 Testes

```bash
# Rodar todos os testes
pnpm test

# Testes de conteúdo
pnpm test server/content.test.ts

# Testes de admin
pnpm test server/admin.test.ts
```

## 📞 Contato

- **Instagram:** [@vivabemnaestrada](https://instagram.com/vivabemnaestrada)
- **YouTube:** [@vivabemnaestrada](https://youtube.com/@vivabemnaestrada)
- **Facebook:** [Viva Bem na Estrada](https://facebook.com/profile.php?id=61580852677265)

## ☁️ Deploy

A aplicação está otimizada para deploy na **Vercel**. O arquivo ``vite.config.ts`` já está configurado para gerar os arquivos estáticos na pasta correta (dist) a partir da raiz.

## 📝 Licença

© 2025 Viva Bem na Estrada. Todos os direitos reservados.

---

_Desenvolvido com ❤️ para quem vive na estrada por PedroVonMises. 🚀_
