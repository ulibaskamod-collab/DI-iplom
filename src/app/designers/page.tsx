'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Palette } from 'lucide-react';

interface Designer {
  id: number;
  designer_name: string;
  bio: string;
  designer_image: string;
  social_links: any;
  works_count?: number;
}

export default function DesignersPage() {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch('/api/designers')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка загрузки');
        return res.json();
      })
      .then(data => {
        setDesigners(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleImageError = (id: number) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const getImageUrl = (path: string | null | undefined) => {
    if (!path) return null;
    // Если путь уже начинается с /, оставляем
    if (path.startsWith('/')) return path;
    // Если путь начинается с uploads, добавляем /
    if (path.startsWith('uploads/')) return `/${path}`;
    // Если это просто имя файла
    return `/uploads/designers/${path}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25] px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-white/50 text-lg mb-4">Не удалось загрузить дизайнеров</p>
          <p className="text-white/30 text-sm mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-white font-medium hover:opacity-90 transition"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d25] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">
          Дизайнеры
        </h1>
        <p className="text-center text-white/50 text-lg mb-12 max-w-2xl mx-auto">
          Великие кутюрье, чьи творения вдохновляют стиль знаков зодиака
        </p>

        {designers.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👗</div>
            <p className="text-white/50">Дизайнеры не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designers.map((designer) => {
              const imageUrl = getImageUrl(designer.designer_image);
              const hasError = imageErrors[designer.id];

              return (
                <Link
                  key={designer.id}
                  href={`/designers/${designer.id}`}
                  className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-white/5 to-white/10 relative overflow-hidden">
                    {imageUrl && !hasError ? (
                      <img
                        src={imageUrl}
                        alt={designer.designer_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => handleImageError(designer.id)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center text-4xl">
                          {designer.designer_name?.charAt(0)?.toUpperCase() || '👤'}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition">
                      {designer.designer_name}
                    </h3>
                    <p className="text-white/50 text-sm line-clamp-2">
                      {designer.bio || 'Дизайнер'}
                    </p>
                    {designer.works_count !== undefined && (
                      <p className="text-white/30 text-xs mt-2">
                        Работ: {designer.works_count}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}