import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { trpc } from "@/lib/trpc";
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminPosts() {
  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.admin.posts.list.useQuery();
  
  const deleteMutation = trpc.admin.posts.delete.useMutation({
    onSuccess: () => {
      toast.success("Post excluído com sucesso!");
      utils.admin.posts.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: () => {
      toast.error("Erro ao excluir post");
    }
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Posts</h1>
            <p className="text-slate-400 mt-1">Gerencie os artigos do blog</p>
          </div>
          <Link href="/admin/posts/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Post
            </Button>
          </Link>
        </div>

        {/* Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Todos os Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : posts?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Nenhum post encontrado</p>
                <Link href="/admin/posts/new">
                  <Button className="mt-4 bg-primary hover:bg-primary/90">
                    Criar primeiro post
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Título</TableHead>
                    <TableHead className="text-slate-400">Categoria</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Data</TableHead>
                    <TableHead className="text-slate-400 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts?.map((post) => (
                    <TableRow key={post.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-3">
                          <img 
                            src={post.image} 
                            alt={post.title}
                            className="w-12 h-8 object-cover rounded"
                          />
                          <span className="truncate max-w-[200px]">{post.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs">
                          {post.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        {post.published ? (
                          <span className="flex items-center gap-1 text-green-500 text-sm">
                            <Eye className="h-3 w-3" /> Publicado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-500 text-sm">
                            <EyeOff className="h-3 w-3" /> Rascunho
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {formatDate(post.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/posts/${post.id}`}>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-slate-900 border-slate-800">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Excluir Post</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                  Tem certeza que deseja excluir "{post.title}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate({ id: post.id })}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
