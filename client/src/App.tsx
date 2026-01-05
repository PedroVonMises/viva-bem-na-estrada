import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import PostDetails from "./pages/PostDetails";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Ebooks from "./pages/Ebooks";
import Social from "./pages/Social";
import VivaBem from "./pages/VivaBem";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPosts from "./pages/admin/Posts";
import PostForm from "./pages/admin/PostForm";
import AdminVideos from "./pages/admin/Videos";
import VideoForm from "./pages/admin/VideoForm";
import AdminEbooks from "./pages/admin/Ebooks";
import EbookForm from "./pages/admin/EbookForm";
import AdminNewsletter from "./pages/admin/Newsletter";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/"} component={Home} />
      <Route path={"/sobre"} component={About} />
      <Route path={"/ebooks"} component={Ebooks} />
      <Route path={"/social"} component={Social} />
      <Route path={"/viva-bem"} component={VivaBem} />
      <Route path="/post/:slug" component={PostDetails} />
      
      {/* Admin Routes */}
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/posts"} component={AdminPosts} />
      <Route path={"/admin/posts/new"} component={PostForm} />
      <Route path={"/admin/posts/:id"} component={PostForm} />
      <Route path={"/admin/videos"} component={AdminVideos} />
      <Route path={"/admin/videos/new"} component={VideoForm} />
      <Route path={"/admin/videos/:id"} component={VideoForm} />
      <Route path={"/admin/ebooks"} component={AdminEbooks} />
      <Route path={"/admin/ebooks/new"} component={EbookForm} />
      <Route path={"/admin/ebooks/:id"} component={EbookForm} />
      <Route path={"/admin/newsletter"} component={AdminNewsletter} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
