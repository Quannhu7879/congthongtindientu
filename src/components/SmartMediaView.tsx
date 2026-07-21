import React from 'react';
import { Play, Youtube, HardDrive, FileImage } from 'lucide-react';

export interface ParsedMedia {
  type: 'youtube' | 'gdrive' | 'image' | 'unknown';
  originalUrl: string;
  embedUrl?: string;
  imageUrl?: string;
  id?: string;
}

export function parseMediaUrl(url: string | undefined): ParsedMedia {
  if (!url) {
    return { type: 'unknown', originalUrl: '' };
  }
  
  const trimmed = url.trim();
  
  // 1. YouTube Matchers
  const ytRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const ytMatch = trimmed.match(ytRegExp);
  if (ytMatch && ytMatch[2].length === 11) {
    const videoId = ytMatch[2];
    return {
      type: 'youtube',
      originalUrl: trimmed,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      imageUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      id: videoId
    };
  }

  // 2. Google Drive Matchers
  const gdRegExp = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]{25,})/;
  const gdMatch = trimmed.match(gdRegExp);
  if (gdMatch && gdMatch[1]) {
    const fileId = gdMatch[1];
    return {
      type: 'gdrive',
      originalUrl: trimmed,
      embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
      imageUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`,
      id: fileId
    };
  }

  return {
    type: 'image',
    originalUrl: trimmed,
    imageUrl: trimmed
  };
}

interface SmartMediaViewProps {
  url: string | undefined;
  alt?: string;
  className?: string;
  showPlayerInDetail?: boolean;
  fallbackUrl?: string;
}

export default function SmartMediaView({
  url,
  alt = 'Media content',
  className = 'w-full h-full object-cover',
  showPlayerInDetail = false,
  fallbackUrl = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=400'
}: SmartMediaViewProps) {
  const media = parseMediaUrl(url);

  // If no URL is provided, display fallback image
  if (!url || media.type === 'unknown') {
    return (
      <img
        src={fallbackUrl}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
      />
    );
  }

  // 1. YouTube handling
  if (media.type === 'youtube') {
    if (showPlayerInDetail && media.embedUrl) {
      return (
        <div className="w-full h-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-200">
          <iframe
            src={media.embedUrl}
            title={alt}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
    }

    // Thumbnail preview for lists / previews
    return (
      <div className="w-full h-full relative group bg-black overflow-hidden">
        <img
          src={media.imageUrl}
          alt={alt}
          className={`${className} opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackUrl;
          }}
        />
        {/* YouTube Visual Overlay Badge */}
        <div className="absolute top-2 right-2 bg-rose-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow uppercase tracking-wider z-10">
          <Youtube className="w-2.5 h-2.5" />
          <span>YouTube</span>
        </div>
        {/* Play Button Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Google Drive handling
  if (media.type === 'gdrive') {
    if (showPlayerInDetail && media.embedUrl) {
      return (
        <div className="w-full h-full aspect-video rounded-2xl overflow-hidden bg-slate-900 shadow-inner border border-slate-200">
          <iframe
            src={media.embedUrl}
            title={alt}
            className="w-full h-full border-none"
            allow="autoplay"
            allowFullScreen
          />
        </div>
      );
    }

    // Thumbnail preview for lists / previews
    return (
      <div className="w-full h-full relative group bg-slate-950 overflow-hidden">
        <img
          src={media.imageUrl}
          alt={alt}
          className={`${className} opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500`}
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = fallbackUrl;
          }}
        />
        {/* Google Drive Visual Overlay Badge */}
        <div className="absolute top-2 right-2 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow uppercase tracking-wider z-10">
          <HardDrive className="w-2.5 h-2.5" />
          <span>Drive</span>
        </div>
        {/* Play or Preview Overlay icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    );
  }

  // 3. Fallback standard image url
  return (
    <img
      src={media.imageUrl || fallbackUrl}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={(e) => {
        (e.target as HTMLImageElement).src = fallbackUrl;
      }}
    />
  );
}
