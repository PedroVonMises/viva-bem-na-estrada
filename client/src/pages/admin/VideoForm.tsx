import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminGetVideoById, adminCreateVideo, adminUpdateVideo, adminGetStats } from "@shared/data";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertVideo } from "../../../drizzle/schema";

export default function VideoForm() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const isEditing = params.id && params.id !== 'new';
  const videoId = isEditing ? parseInt(params.id) : null;

  const [formData, setFormData] = useState({
    youtubeId: "",
    title: "",
    description: "",
    thumbnail: "",
    duration: "",
    published: true,
    featured: false,
  });

  const queryClient = useQueryClient();
  
  const { data: video, isLoading: loadingVideo } = useQuery({ queryKey: ["adminVideo", videoId], queryFn: () => adminGetVideoById(videoId!), enabled: !!videoId });

  useEffect(() => {
    if (video) {
      setFormData({
        youtubeId: video.youtubeId || "",
        title: video.title,
        description: video.description || "",
        thumbnail: video.thumbnail,
        duration: video.duration,
        published: video.published,
        featured: video.featured,
      });
    }
  }, [video]);

  const createMutation = useMutation({ mutationFn: (data: InsertVideo) => adminCreateVideo(data),
    onSuccess: () => {
      toast.success("Vídeo criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminVideos"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setLocation("/admin/videos");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar vídeo");
    }
  });

  const updateMutation = useMutation({ mutationFn: (data: { id: number, video: Partial<InsertVideo> }) => adminUpdateVideo(data.id, data.video),
    onSuccess: () => {
      toast.success("Vídeo atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminVideos"] });
      setLocation("/admin/videos");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar vídeo");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && videoId) {
      updateMutation.mutate({ id: videoId, video: formData });
    } else {
      createMutation.mutate(formData as InsertVideo);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (loadingVideo && isEditing) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/videos">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditing ? "Editar Vídeo" : "Novo Vídeo"}
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Informações do Vídeo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Título do vídeo"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtubeId" className="text-slate-300">ID do YouTube</Label>
                  <Input
                    id="youtubeId"
                    value={formData.youtubeId}
                    onChange={(e) => setFormData(prev => ({ ...prev, youtubeId: e.target.value }))}
                    placeholder="Ex: dQw4w9WgXcQ"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <p className="text-xs text-slate-500">O ID é a parte final da URL do YouTube (youtube.com/watch?v=ID)</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do vídeo"
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail" className="text-slate-300">URL da Thumbnail *</Label>
                  <Input
                    id="thumbnail"
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                    placeholder="https://exemplo.com/thumbnail.jpg"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-slate-300">Duração *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="Ex: 12:45"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              {formData.thumbnail && (
                <div>
                  <Label className="text-slate-300 mb-2 block">Preview da Thumbnail</Label>
                  <img src={formData.thumbnail} alt="Preview" className="h-40 object-cover rounded" />
                </div>
              )}

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
                <Link href="/admin/videos">
                  <Button type="button" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="bg-purple-500 hover:bg-purple-600">
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" /> {isEditing ? "Atualizar" : "Criar"} Vídeo</>
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
