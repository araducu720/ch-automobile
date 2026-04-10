import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getBlogPost } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { SafeHtml } from '@/components/ui/safe-html';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTranslations } from 'next-intl/server';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld';
import {
  ChevronLeft,
  Calendar,
  User,
  Eye,
  Clock,
  Share2,
} from 'lucide-react';

interface BlogPostPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = await getTranslations('blog');
  try {
    const { data: post } = await getBlogPost(slug);
    return {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      openGraph: {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt,
        images: post.featured_image ? [post.featured_image] : [],
        type: 'article',
        publishedTime: post.published_at || undefined,
        authors: [post.author],
      },
    };
  } catch {
    return { title: t('notFound') };
  }
}

function estimateReadTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const t = await getTranslations('blog');
  const tv = await getTranslations('vehicles');

  let post;
  try {
    const response = await getBlogPost(slug);
    post = response.data;
  } catch {
    notFound();
  }

  const readTime = estimateReadTime(post.content || '');

  return (
    <div className="page-transition">
      <ArticleJsonLd
        title={post.title}
        description={post.excerpt || undefined}
        image={post.featured_image || undefined}
        author={post.author}
        publishedAt={post.published_at || undefined}
        url={`/blog/${post.slug}`}
      />
      <BreadcrumbJsonLd items={[
        { name: tv('breadcrumbHome'), href: '/' },
        { name: t('title'), href: '/blog' },
        { name: post.title },
      ]} />

      {/* Breadcrumb */}
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
        <div className="container-main py-4">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-tertiary)]">
            <Link href="/" className="hover:text-[var(--text-primary)] transition-colors">
              {tv('breadcrumbHome')}
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--text-primary)] transition-colors">
              {t('title')}
            </Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] truncate max-w-[200px]">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      <article className="py-8 lg:py-12">
        <div className="container-main">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('backToBlog')}
          </Link>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
            {/* Main content */}
            <div className="min-w-0">
              {/* Header */}
              <header className="mb-8">
                {post.category && (
                  <Link href={`/blog?category=${post.category.slug}`}>
                    <Badge variant="secondary" className="mb-4">
                      {post.category.name}
                    </Badge>
                  </Link>
                )}

                <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl leading-tight">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="mt-4 text-lg text-[var(--text-secondary)] leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                {/* Meta */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-[var(--text-tertiary)] border-b border-[var(--border-primary)] pb-6">
                  {post.published_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.published_at)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {readTime} {t('readingTimeUnit')}
                  </span>
                  {post.views_count > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      {post.views_count.toLocaleString()} {t('views')}
                    </span>
                  )}
                </div>
              </header>

              {/* Featured image */}
              {post.featured_image && (
                <div className="relative aspect-[16/9] mb-8 rounded-xl overflow-hidden bg-[var(--bg-tertiary)]">
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 800px"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Article body */}
              <SafeHtml
                className="prose prose-lg max-w-none text-[var(--text-primary)] dark:prose-invert
                  prose-headings:font-bold prose-headings:tracking-tight
                  prose-a:text-[var(--text-link)] prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl
                  prose-strong:text-[var(--text-primary)]
                  prose-p:leading-relaxed
                  prose-li:leading-relaxed"
                html={post.content}
              />

              {/* Share / Back */}
              <div className="mt-10 flex items-center justify-between border-t border-[var(--border-primary)] pt-6">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/blog">
                    <ChevronLeft className="h-4 w-4" />
                    {t('backToBlog')}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Author card */}
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                    {t('author')}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-primary-light)]">
                      <User className="h-5 w-5 text-[var(--brand-primary)]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {post.author}
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)]">C-H Automobile</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Related posts */}
              {post.related && post.related.length > 0 && (
                <Card>
                  <CardContent className="p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
                      {t('relatedPosts')}
                    </h3>
                    <div className="space-y-4">
                      {post.related.map((related) => (
                        <Link
                          key={related.id}
                          href={`/blog/${related.slug}`}
                          className="group block"
                        >
                          {related.featured_image_thumbnail && (
                            <div className="relative aspect-[16/9] mb-2 rounded-lg overflow-hidden">
                              <Image
                                src={related.featured_image_thumbnail}
                                alt={related.title}
                                fill
                                sizes="300px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <h4 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          {related.published_at && (
                            <p className="text-xs text-[var(--text-tertiary)] mt-1">
                              {formatDate(related.published_at)}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* CTA */}
              <Card className="bg-gradient-to-br from-[var(--brand-primary)] to-[#1e3a8a] text-white">
                <CardContent className="p-5 text-center">
                  <h3 className="font-semibold mb-2">{t('lookingForVehicle')}</h3>
                  <p className="text-sm text-white/75 mb-4">
                    {t('discoverPremium')}
                  </p>
                  <Button variant="accent" size="sm" asChild>
                    <Link href="/fahrzeuge">{t('viewVehicles')}</Link>
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </article>
    </div>
  );
}
