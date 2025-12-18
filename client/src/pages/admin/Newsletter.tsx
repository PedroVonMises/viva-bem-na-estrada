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
import { adminGetSubscribers, adminDeleteSubscriber, adminGetStats } from "@shared/data";
import { Trash2, Loader2, Mail, Download, Users } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function AdminNewsletter() {
  const queryClient = useQueryClient();
  const { data: subscribers, isLoading } = useQuery({ queryKey: ["adminSubscribers"], queryFn: adminGetSubscribers });
  
  const deleteMutation = useMutation({ mutationFn: adminDeleteSubscriber,
    onSuccess: () => {
      toast.success("Inscrito removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["adminSubscribers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: () => {
      toast.error("Erro ao remover inscrito");
    }
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    if (!subscribers || subscribers.length === 0) {
      toast.error("Nenhum inscrito para exportar");
      return;
    }

    const headers = ["Nome", "E-mail", "Data de Inscrição", "Ativo"];
    const rows = subscribers.map(sub => [
      sub.name || "-",
      sub.email,
      formatDate(sub.createdAt),
      sub.active ? "Sim" : "Não"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter-inscritos-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success("Lista exportada com sucesso!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Newsletter</h1>
            <p className="text-slate-400 mt-1">Gerencie os inscritos na newsletter</p>
          </div>
          <Button onClick={exportToCSV} className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats Card */}
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{subscribers?.length ?? 0}</p>
                <p className="text-slate-400 text-sm">Total de Inscritos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Lista de Inscritos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : subscribers?.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Nenhum inscrito na newsletter ainda</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Nome</TableHead>
                    <TableHead className="text-slate-400">E-mail</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Data</TableHead>
                    <TableHead className="text-slate-400 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers?.map((subscriber) => (
                    <TableRow key={subscriber.id} className="border-slate-800 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-white">
                        {subscriber.name || "-"}
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <a 
                          href={`mailto:${subscriber.email}`} 
                          className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          {subscriber.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        {subscriber.active ? (
                          <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">
                            Ativo
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-500/10 text-slate-500 rounded text-xs">
                            Inativo
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-slate-400 text-sm">
                        {formatDate(subscriber.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-900 border-slate-800">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">Remover Inscrito</AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-400">
                                Tem certeza que deseja remover "{subscriber.email}" da newsletter? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(subscriber.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
