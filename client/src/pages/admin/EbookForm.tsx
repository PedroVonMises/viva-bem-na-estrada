import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminGetEbookById, adminCreateEbook, adminUpdateEbook, adminGetStats } from "@shared/data";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Link, useParams, useLocation } from "wouter";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertEbook } from "../../../drizzle/schema";

export default function EbookForm() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const isEditing = params.id && params.id !== 'new';
  const ebookId = isEditing ? parseInt(params.id) : null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    downloadUrl: "",
    pages: 1,
    published: true,
  });

  const queryClient = useQueryClient();
  
  const { data: ebook, isLoading: loadingEbook } = useQuery({ queryKey: ["adminEbook", ebookId], queryFn: () => adminGetEbookById(ebookId!), enabled: !!ebookId });

  useEffect(() => {
    if (ebook) {
      setFormData({
        title: ebook.title,
        description: ebook.description,
        image: ebook.image,
        downloadUrl: ebook.downloadUrl || "",
        pages: ebook.pages,
        published: ebook.published,
      });
    }
  }, [ebook]);

  const createMutation = useMutation({ mutationFn: (data: InsertEbook) => adminCreateEbook(data),
    onSuccess: () => {
      toast.success("Ebook criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminEbooks"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      setLocation("/admin/ebooks");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar ebook");
    }
  });

  const updateMutation = useMutation({ mutationFn: (data: { id: number, ebook: Partial<InsertEbook> }) => adminUpdateEbook(data.id, data.ebook),
    onSuccess: () => {
      toast.success("Ebook atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminEbooks"] });
      setLocation("/admin/ebooks");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar ebook");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && ebookId) {
      updateMutation.mutate({ id: ebookId, ebook: formData });
    } else {
      createMutation.mutate(formData as InsertEbook);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (loadingEbook && isEditing) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin/ebooks">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">
              {isEditing ? "Editar Ebook" : "Novo Ebook"}
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Informações do Ebook</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-slate-300">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título do ebook"
                  className="bg-slate-800 border-slate-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-300">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do ebook"
                  className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-slate-300">URL da Capa *</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://exemplo.com/capa.jpg"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages" className="text-slate-300">Número de Páginas *</Label>
                  <Input
                    id="pages"
                    type="number"
                    min="1"
                    value={formData.pages}
                    onChange={(e) => setFormData(prev => ({ ...prev, pages: parseInt(e.target.value) || 1 }))}
                    placeholder="Ex: 50"
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="downloadUrl" className="text-slate-300">URL de Download</Label>
                <Input
                  id="downloadUrl"
                  type="url"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, downloadUrl: e.target.value }))}
                  placeholder="https://exemplo.com/ebook.pdf"
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-xs text-slate-500">Link direto para download do PDF</p>
              </div>

              {formData.image && (
                <div>
                  <Label className="text-slate-300 mb-2 block">Preview da Capa</Label>
                  <img src={formData.image} alt="Preview" className="h-48 object-cover rounded" />
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published" className="text-slate-300">Publicado</Label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Link href="/admin/ebooks">
                  <Button type="button" variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                    Cancelar
                  </Button>
                </Link>
                <Button type="submit" disabled={isSubmitting} className="bg-green-500 hover:bg-green-600">
                  {isSubmitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</>
                  ) : (
                    <><Save className="h-4 w-4 mr-2" /> {isEditing ? "Atualizar" : "Criar"} Ebook</>
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
