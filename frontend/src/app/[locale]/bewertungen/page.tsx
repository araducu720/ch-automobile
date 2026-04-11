import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getReviews } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { ReviewForm } from '@/components/forms/review-form';
import { formatDate, getInitials } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight, MessageSquarePlus } from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('reviews');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const t = await getTranslations('reviews');
  const tp = await getTranslations('pagination');

  let reviewsData;
  try {
    reviewsData = await getReviews({ page });
  } catch {
    return (
      <div className="container-main py-16 text-center">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-muted">{t('subtitle')}</p>
      </div>
    );
  }

  const { data: reviews, meta, aggregate } = reviewsData;

  return (
    <div className="py-8 lg:py-12">
      <div className="container-main">
        <div className="max-w-2xl mb-10">
          <h1 className="text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="mt-2 text-muted">
            {t('subtitle')}
          </p>
        </div>

        {/* Stats */}
        {aggregate && (
          <Card className="mb-10">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-brand">
                    {aggregate.average_rating.toFixed(1)}
                  </div>
                  <StarRating rating={aggregate.average_rating} size="md" className="mt-1 justify-center" />
                  <p className="mt-1 text-sm text-muted">
                    {t('totalReviews', { count: aggregate.total_count })}
                  </p>
                </div>
                <div className="flex-1 space-y-1.5 w-full max-w-xs">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = aggregate.breakdown[star] || 0;
                    const percentage = aggregate.total_count > 0 ? (count / aggregate.total_count) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2 text-sm">
                        <span className="w-6 text-right text-muted-foreground">{star}★</span>
                        <div className="flex-1 h-2 rounded-full bg-tertiary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-xs text-muted-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand font-semibold text-sm shrink-0">
                        {getInitials(review.customer_name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground">{review.customer_name}</h3>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDate(review.created_at)}
                          </span>
                        </div>
                        <StarRating rating={review.rating} size="sm" className="mt-1" />
                        {review.title && (
                          <h4 className="mt-2 font-medium text-foreground">{review.title}</h4>
                        )}
                        <p className="mt-1 text-sm text-muted leading-relaxed">
                          {review.comment}
                        </p>
                        {review.vehicle && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            {t('vehiclePrefix', { vehicle: review.vehicle })}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-muted text-center py-8">
                {t('subtitle')}
              </p>
            )}

            {/* Pagination */}
            {meta.last_page > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {meta.current_page > 1 && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/bewertungen?page=${meta.current_page - 1}`}>
                      <ChevronLeft className="h-4 w-4" /> {tp('previous')}
                    </Link>
                  </Button>
                )}
                <span className="px-4 text-sm text-muted">
                  {tp('page', { current: meta.current_page, total: meta.last_page })}
                </span>
                {meta.current_page < meta.last_page && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/bewertungen?page=${meta.current_page + 1}`}>
                      {tp('next')} <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Write review */}
          <div>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
                  <MessageSquarePlus className="h-5 w-5" />
                  {t('writeReview')}
                </h2>
                <p className="text-sm text-muted mb-6">
                  {t('subtitle')}
                </p>
                <ReviewForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
