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
import { Plus, Pencil, Trash2, Loader2, Eye, EyeOff, FileText } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AdminEbooks() {
  const utils = trpc.useUtils();
  const { data: ebooks, isLoading } = trpc.admin.ebooks.list.useQuery();
  
  const deleteMutation = trpc.admin.ebooks.delete.useMutation({
    onSuccess: () => {
      toast.success("Ebook excluído com sucesso!");
      utils.admin.ebooks.list.invalidate();
      utils.admin.stats.invalidate();
    },
    onError: () => {
      toast.error("Erro ao excluir ebook");
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
            <h1 className="text-3xl font-bold text-white">Ebooks</h1>
            <p className="text-slate-400 mt-1">Gerencie os materiais ricos</p>
          </div>
          <Link href="/admin/ebooks/new">
            <Button className="bg-green-500 hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Novo Ebook
            </Button>
          </Link>
        </div>

        {/* Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Todos os Ebooks</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
              </div>
            ) : ebooks?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Nenhum ebook encontrado</p>
                <Link href="/admin/ebooks/new">
                  <Button className="mt-4 bg-green-500 hover:bg-green-600">
                    Criar primeiro ebook
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Título</TableHead>
                    <TableHead className="text-slate-400">Páginas</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Data</TableHead>
                    <TableHead className="text-slate-400 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ebooks?.map((ebook) => (
                    <TableRow key={ebook.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-3">
                          <img 
                            src={ebook.image} 
                            alt={ebook.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <span className="truncate max-w-[200px]">{ebook.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-slate-300 text-sm">
                          <FileText className="h-3 w-3" /> {ebook.pages} págs
                        </span>
                      </TableCell>
                      <TableCell>
                        {ebook.published ? (
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
                        {formatDate(ebook.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/ebooks/${ebook.id}`}>
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
                                <AlertDialogTitle className="text-white">Excluir Ebook</AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400">
                                  Tem certeza que deseja excluir "{ebook.title}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteMutation.mutate({ id: ebook.id })}
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
