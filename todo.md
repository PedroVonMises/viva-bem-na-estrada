# Plano de Execução: Viva Bem na Estrada

## 1. Setup e Configuração Inicial
- [ ] **Inicialização do Projeto**: Verificar estrutura criada pelo `webdev_init_project`.
- [ ] **Limpeza**: Remover arquivos de exemplo desnecessários (se houver).
- [ ] **Configuração Tailwind**:
    - [ ] Definir paleta de cores "Deep Navy" e "Vibrant Orange" no `client/src/index.css` (variáveis CSS).
    - [ ] Configurar fontes (Inter/Roboto) no `client/index.html` e `client/src/index.css`.
    - [ ] Configurar `border-radius` e outros tokens de design.
- [ ] **Instalação de Dependências**:
    - [ ] `lucide-react` (já instalado no template, verificar versão).
    - [ ] `framer-motion` (já instalado no template, verificar versão).
    - [ ] `clsx` e `tailwind-merge` (para utilitários de classe).

## 2. Componentes Atômicos (Design System)
- [ ] **Button**: Criar variantes `default` (Laranja), `outline` (Borda Laranja/Branca), `ghost` e `link`.
- [ ] **Card**: Componente base com background `slate-900`, bordas sutis e hover effects.
- [ ] **Typography**: Componentes para `H1`, `H2`, `H3`, `Paragraph` com cores e tamanhos padronizados.
- [ ] **Input/Form**: Estilização de campos de entrada para newsletter e contato.
- [ ] **Badge/Tag**: Para categorias de posts.

## 3. Layout Base
- [ ] **Navbar**:
    - [ ] Logo (Texto ou Imagem Placeholder).
    - [ ] Links de navegação (Home, Viva Bem, Sobre, Ebooks).
    - [ ] Menu Mobile (Hambúrguer) com animação do Framer Motion.
    - [ ] Efeito de scroll (fundo fica sólido ao rolar).
- [ ] **Footer**:
    - [ ] Links rápidos.
    - [ ] Copyright.
    - [ ] Redes sociais.

## 4. Implementação de Páginas
### A. Home
- [ ] **Hero Section**:
    - [ ] Background Image (Unsplash: Highway/Truck night).
    - [ ] Headline e Subheadline.
    - [ ] CTA Principal.
- [ ] **Destaques (Grid)**:
    - [ ] Componente `PostCard`.
    - [ ] Grid responsivo (1 col mobile, 3 col desktop).
- [ ] **Newsletter Section**:
    - [ ] Formulário de captura simples.

### B. Viva Bem na Estrada (Conteúdo)
- [ ] **Header da Página**: Título e descrição.
- [ ] **YouTube Integration**:
    - [ ] Criar componente `VideoPlayer`.
    - [ ] Implementar lógica de fetch (simulada no front-end estático ou via API real se upgrade).
    - [ ] **Fallback**: Implementar estado de erro/loading com vídeo placeholder.
- [ ] **Lista de Episódios**: Grid de vídeos anteriores.

### C. Sobre Nós
- [ ] **Layout**: Seções alternadas (Zig-zag: Texto-Imagem, Imagem-Texto).
- [ ] **Conteúdo**: História da marca, Dellano, Viva Bem Comunicação.

### D. Ebooks
- [ ] **Grid de Landing Pages**:
    - [ ] Cards visuais para cada Ebook.
    - [ ] Botões de "Baixar" (links externos ou simulados).

### E. Redes Sociais (Social Hub)
- [ ] **Cards Grandes**: Links visuais para Instagram, Facebook, YouTube.
- [ ] **Estilo Mobile-First**: Botões grandes para toque fácil.

## 5. Integrações e Lógica
- [ ] **YouTube API**:
    - [ ] Criar serviço de fetch (abstração).
    - [ ] Tratar erros e estados de loading.
- [ ] **Dados Mockados**: Criar arquivos JSON/TS para posts, ebooks e vídeos (para preencher o site sem backend real por enquanto).

## 6. Refinamento e Polimento
- [ ] **Animações**: Adicionar transições de página e hover effects com Framer Motion.
- [ ] **Responsividade**: Testar em breakpoints Mobile, Tablet e Desktop.
- [ ] **Acessibilidade**: Verificar contrastes e tags ARIA.
- [ ] **SEO Básico**: Meta tags (título, descrição) em cada página.

## 7. Entrega
- [ ] **Build**: Rodar `npm run build` para garantir integridade.
- [ ] **Checkpoint**: Salvar estado final.


## 8. Integração com Banco de Dados
- [x] Definir esquema do banco de dados (Posts, Vídeos, Ebooks, Newsletter)
- [x] Executar migrações com `pnpm db:push`
- [x] Criar rotas tRPC para CRUD de conteúdo
- [x] Popular banco de dados com dados iniciais (Seed)
- [x] Integrar frontend com API backend
- [x] Criar testes unitários para as rotas


## 9. Painel Administrativo
- [x] Criar rotas protegidas de admin (CRUD completo)
- [x] Criar página Dashboard com estatísticas
- [x] Criar página de gerenciamento de Posts
- [x] Criar página de gerenciamento de Vídeos
- [x] Criar página de gerenciamento de Ebooks
- [x] Criar página de visualização de Inscritos na Newsletter
- [x] Implementar formulários de criação e edição
- [x] Testar funcionalidades do painel
