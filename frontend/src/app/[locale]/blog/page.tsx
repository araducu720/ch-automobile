import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getBlogPosts, getBlogCategories } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('blog');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const category = params.category;
  const t = await getTranslations('blog');
  const tp = await getTranslations('pagination');

  let posts, categories;
  try {
    [posts, categories] = await Promise.all([
      getBlogPosts({ page, category }),
      getBlogCategories(),
    ]);
  } catch {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-muted">{t('noPosts')}</p>
      </div>
    );
  }

  return (
    <div className="py-8 lg:py-12">
      <div className="container-main">
        <div className="max-w-2xl mb-10">
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-2 text-muted">
            {t('subtitle')}
          </p>
        </div>

        {/* Categories */}
        {categories.data.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link href="/blog">
              <Badge variant={!category ? 'default' : 'outline'} className="cursor-pointer">
                {t('allPosts')}
              </Badge>
            </Link>
            {categories.data.map((cat) => (
              <Link key={cat.id} href={`/blog?category=${cat.slug}`}>
                <Badge
                  variant={category === cat.slug ? 'default' : 'outline'}
                  className="cursor-pointer"
                >
                  {cat.name || cat.slug}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {/* Posts grid */}
        {posts.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.data.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                    {post.featured_image_thumbnail && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={post.featured_image_thumbnail}
                          alt={post.title || ''}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          priority={index < 3}
                        />
                      </div>
                    )}
                    <CardContent className="p-5 space-y-3">
                      {post.category && (
                        <Badge variant="secondary" className="text-xs">
                          {post.category.name || ''}
                        </Badge>
                      )}
                      <h2 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-brand transition-colors">
                        {post.title || post.slug}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-muted line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {post.published_at ? formatDate(post.published_at) : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {post.author}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {posts.meta.last_page > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                {posts.meta.current_page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog?page=${posts.meta.current_page - 1}${category ? `&category=${category}` : ''}`}>
                      <ChevronLeft className="h-4 w-4" /> {tp('previous')}
                    </Link>
                  </Button>
                )}
                <span className="px-4 text-sm text-muted">
                  {tp('page', { current: posts.meta.current_page, total: posts.meta.last_page })}
                </span>
                {posts.meta.current_page < posts.meta.last_page && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/blog?page=${posts.meta.current_page + 1}${category ? `&category=${category}` : ''}`}>
                      {tp('next')} <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted">{t('noPosts')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
