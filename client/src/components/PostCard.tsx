import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface PostCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  featured?: boolean;
}

export default function PostCard({ 
  title, 
  excerpt, 
  image, 
  date, 
  readTime, 
  category, 
  slug,
  featured = false
}: PostCardProps) {
  return (
    <Link 
      href={`/post/${slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-card border border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(234,88,12,0.15)]",
        featured ? "md:grid md:grid-cols-2 md:gap-8" : ""
      )}
    >
      {/* Image Container */}
      <div className={cn(
        "relative overflow-hidden",
        featured ? "h-64 md:h-full" : "h-56"
      )}>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
        <img 
          src={image} 
          alt={title} 
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            {category}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} className="text-primary" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} className="text-primary" />
            <span>{readTime}</span>
          </div>
        </div>

        <h3 className={cn(
          "font-sans font-bold text-white mb-3 group-hover:text-primary transition-colors",
          featured ? "text-2xl md:text-3xl" : "text-xl"
        )}>
          {title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
          {excerpt}
        </p>

        <div className="flex items-center text-primary font-bold text-sm mt-auto">
          Ler Artigo Completo
          <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
