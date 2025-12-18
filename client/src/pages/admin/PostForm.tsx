import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function PostForm() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const isEditing = params.id && params.id !== 'new';
  const postId = isEditing ? parseInt(params.id) : null;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    image: "",
    category: "",
    readTime: "",
    published: true,
    featured: false,
  });

  const utils = trpc.useUtils();
  
  const { data: post, isLoading: loadingPost } = trpc.admin.posts.byId.useQuery(
    { id: postId! },
    { enabled: !!postId }
  );

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content || "",
        image: post.image,
        category: post.category,
        readTime: post.readTime,
        published: post.published,
        featured: post.featured,
      });
    }
  }, [post]);

  const createMutation = trpc.admin.posts.create.useMutation({
    onSuccess: () => {
      toast.success("Post criado com sucesso!");
      utils.admin.posts.list.invalidate();
      utils.admin.stats.invalidate();
      setLocation("/admin/posts");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar post");
    }
  });

  const updateMutation = trpc.admin.posts.update.useMutation({
    onSuccess: () => {
      toast.success("Post atualizado com sucesso!");
      utils.admin.posts.list.invalidate();
      setLocation("/admin/posts");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar post");
    }
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: !isEditing ? generateSlug(title) : prev.slug
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && postId) {
      updateMutation.mutate({ id: postId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (loadingPost && isEditing) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/posts">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditing ? "Editar Post" : "Novo Post"}
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Informações do Post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Título do post"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-slate-300">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-do-post"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-slate-300">Resumo *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Breve descrição do post"
                  className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-slate-300">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Conteúdo completo do post (suporta Markdown)"
                  className="bg-slate-800 border-slate-700 text-white min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-slate-300">URL da Imagem *</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
                {formData.image && (
                  <img src={formData.image} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-300">Categoria *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Ex: Mecânica, Rotas, Tecnologia"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readTime" className="text-slate-300">Tempo de Leitura *</Label>
                  <Input
                    id="readTime"
                    value={formData.readTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                    placeholder="Ex: 5 min"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-8 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-3">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published" className="text-slate-300">Publicado</Label>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured" className="text-slate-300">Destaque</Label>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Link href="/admin/posts">
                  <Button type="button" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" /> {isEditing ? "Atualizar" : "Criar"} Post</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
}
