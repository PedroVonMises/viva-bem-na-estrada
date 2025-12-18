import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { FileText, Video, BookOpen, Users, Loader2, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  const statCards = [
    {
      title: "Posts",
      value: stats?.posts ?? 0,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      href: "/admin/posts"
    },
    {
      title: "Vídeos",
      value: stats?.videos ?? 0,
      icon: Video,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      href: "/admin/videos"
    },
    {
      title: "Ebooks",
      value: stats?.ebooks ?? 0,
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      href: "/admin/ebooks"
    },
    {
      title: "Inscritos",
      value: stats?.subscribers ?? 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
      href: "/admin/newsletter"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Visão geral do seu conteúdo</p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => (
              <Card 
                key={stat.title} 
                className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                onClick={() => window.location.href = stat.href}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    Atualizado agora
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Criar Novo Post
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">
                Publique um novo artigo para seus leitores.
              </p>
              <a 
                href="/admin/posts/new" 
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Criar Post
              </a>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Video className="h-5 w-5 text-purple-500" />
                Adicionar Vídeo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">
                Adicione um novo vídeo do canal.
              </p>
              <a 
                href="/admin/videos/new" 
                className="inline-flex items-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Adicionar Vídeo
              </a>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-500" />
                Novo Ebook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 text-sm mb-4">
                Disponibilize um novo material rico.
              </p>
              <a 
                href="/admin/ebooks/new" 
                className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Criar Ebook
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
