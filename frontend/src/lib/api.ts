import 'server-only';
import { API_URL, DEFAULT_LOCALE } from './constants';
import type {
  Vehicle,
  VehicleFilters,
  BlogPost,
  BlogCategory,
  Review,
  ReviewAggregate,
  CompanySettings,
  PaginatedResponse,
  ApiResponse,
  InquiryFormData,
  TradeInFormData,
  ReservationFormData,
  ReviewFormData,
  NewsletterFormData,
  Reservation,
  Inquiry,
} from '@/types';
import { buildSearchParams } from './utils';
import { AsyncLocalStorage } from 'async_hooks';

/* ============================================
   Locale helper — request-scoped via AsyncLocalStorage
   ============================================ */

const localeStorage = new AsyncLocalStorage<string>();

/** Set the locale for subsequent API calls (call from server components / layouts) */
export function setApiLocale(locale: string) {
  (localeStorage as { enterWith(val: string): void }).enterWith(locale);
}

/** Get the current API locale */
export function getApiLocale(): string {
  return localeStorage.getStore() ?? DEFAULT_LOCALE;
}

/** Append locale param to a query string */
function withLocale(params: string): string {
  const locale = getApiLocale();
  const sep = params ? '&' : '?';
  return `${params}${sep}locale=${locale}`;
}

/* ============================================
   HTTP Client with retry logic
   ============================================ */

const MAX_RETRIES = 2;
const RETRY_BASE_DELAY = 500; // ms
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504]);

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...options.headers,
          },
        });

        if (!response.ok) {
          if (attempt < MAX_RETRIES && RETRYABLE_STATUS_CODES.has(response.status)) {
            await sleep(RETRY_BASE_DELAY * Math.pow(2, attempt));
            continue;
          }
          const error = await response.json().catch(() => ({
            message: 'An unexpected error occurred',
          }));
          throw new ApiError(response.status, error.message, error.errors);
        }

        return response.json();
      } catch (e) {
        lastError = e instanceof Error ? e : new Error(String(e));
        if (e instanceof ApiError) throw e;
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_BASE_DELAY * Math.pow(2, attempt));
          continue;
        }
      }
    }

    throw lastError ?? new Error('Request failed after retries');
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async postFormData<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'An unexpected error occurred',
      }));
      throw new ApiError(response.status, error.message, error.errors);
    }

    return response.json();
  }
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const api = new ApiClient(API_URL);

/* ============================================
   Vehicle API
   ============================================ */

export async function getVehicles(
  filters: VehicleFilters = {},
  options?: { next?: NextFetchRequestConfig },
): Promise<PaginatedResponse<Vehicle>> {
  const params = buildSearchParams(filters as Record<string, string | number | boolean | undefined>);
  return api.get<PaginatedResponse<Vehicle>>(`/vehicles${withLocale(params)}`, {
    next: { revalidate: 60, ...options?.next },
  });
}

export async function getVehicle(
  slug: string,
  options?: { next?: NextFetchRequestConfig },
): Promise<ApiResponse<Vehicle>> {
  return api.get<ApiResponse<Vehicle>>(`/vehicles/${slug}${withLocale('')}`, {
    next: { revalidate: 60, ...options?.next },
  });
}

export async function getFeaturedVehicles(
  options?: { next?: NextFetchRequestConfig },
): Promise<ApiResponse<Vehicle[]>> {
  return api.get<ApiResponse<Vehicle[]>>(`/vehicles/featured${withLocale('')}`, {
    next: { revalidate: 120, ...options?.next },
  });
}

export async function getVehicleBrands(
  options?: { next?: NextFetchRequestConfig },
): Promise<ApiResponse<string[]>> {
  return api.get<ApiResponse<string[]>>(`/vehicles/brands${withLocale('')}`, {
    next: { revalidate: 300, ...options?.next },
  });
}

/* ============================================
   Inquiry API
   ============================================ */

export async function submitInquiry(
  data: InquiryFormData,
): Promise<ApiResponse<Inquiry>> {
  return api.post<ApiResponse<Inquiry>>('/inquiries', data);
}

export async function submitTradeIn(
  data: TradeInFormData,
): Promise<ApiResponse<Inquiry>> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'photos' && Array.isArray(value)) {
      value.forEach((file: File) => {
        formData.append('photos[]', file);
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  return api.postFormData<ApiResponse<Inquiry>>('/trade-in', formData);
}

/* ============================================
   Reservation API
   ============================================ */

export async function createReservation(
  data: ReservationFormData,
): Promise<ApiResponse<Reservation & { bank_details: unknown }>> {
  return api.post('/reservations', data);
}

export async function getReservation(
  reference: string,
): Promise<ApiResponse<Record<string, unknown>>> {
  return api.get(`/reservations/${reference}`);
}

export async function confirmInvoice(
  reference: string,
): Promise<ApiResponse<{ purchase_step: string }>> {
  return api.post(`/reservations/${reference}/confirm-invoice`);
}

export async function uploadSignature(
  reference: string,
  file: File,
): Promise<ApiResponse<{ purchase_step: string }>> {
  const formData = new FormData();
  formData.append('signature', file);
  return api.postFormData(`/reservations/${reference}/signature`, formData);
}

export async function uploadSignedContract(
  reference: string,
  file: File,
): Promise<ApiResponse<{ purchase_step: string }>> {
  const formData = new FormData();
  formData.append('signed_contract', file);
  return api.postFormData(`/reservations/${reference}/signed-contract`, formData);
}

/** Returns the direct URL for contract PDF download (GET endpoint). */
export function getContractDownloadUrl(reference: string): string {
  return `${API_URL}/reservations/${reference}/contract`;
}

export async function uploadPaymentProof(
  reference: string,
  file: File,
): Promise<ApiResponse<{ purchase_step: string }>> {
  const formData = new FormData();
  formData.append('payment_proof', file);
  return api.postFormData(`/reservations/${reference}/payment-proof`, formData);
}

/* ============================================
   Blog API
   ============================================ */

export async function getBlogPosts(
  params: { page?: number; category?: string } = {},
  options?: { next?: NextFetchRequestConfig },
): Promise<PaginatedResponse<BlogPost>> {
  const searchParams = buildSearchParams(params);
  return api.get<PaginatedResponse<BlogPost>>(`/blog/posts${withLocale(searchParams)}`, {
    next: { revalidate: 120, ...options?.next },
  });
}

export async function getBlogPost(
  slug: string,
  options?: { next?: NextFetchRequestConfig },
): Promise<ApiResponse<BlogPost>> {
  return api.get<ApiResponse<BlogPost>>(`/blog/posts/${slug}${withLocale('')}`, {
    next: { revalidate: 120, ...options?.next },
  });
}

export async function getBlogCategories(
  options?: { next?: NextFetchRequestConfig },
): Promise<ApiResponse<BlogCategory[]>> {
  return api.get<ApiResponse<BlogCategory[]>>(`/blog/categories${withLocale('')}`, {
    next: { revalidate: 300, ...options?.next },
  });
}

/* ============================================
   Review API
   ============================================ */

export async function getReviews(
  params: { page?: number } = {},
  options?: { next?: NextFetchRequestConfig },
): Promise<PaginatedResponse<Review> & { aggregate: ReviewAggregate }> {
  const searchParams = buildSearchParams(params);
  return api.get(`/reviews${withLocale(searchParams)}`, {
    next: { revalidate: 120, ...options?.next },
  });
}

export async function submitReview(
  data: ReviewFormData,
): Promise<ApiResponse<Review>> {
  return api.post<ApiResponse<Review>>('/reviews', data);
}

/* ============================================
   Settings API
   ============================================ */

export async function getCompanySettings(
  options?: { next?: NextFetchRequestConfig },
): Promise<ApiResponse<CompanySettings>> {
  return api.get<ApiResponse<CompanySettings>>('/settings', {
    next: { revalidate: 300, ...options?.next },
  });
}

export async function getLegalContent(
  type: 'imprint' | 'privacy' | 'terms',
  options?: { next?: NextFetchRequestConfig },
): Promise<ApiResponse<{ content: string }>> {
  return api.get<ApiResponse<{ content: string }>>(`/legal/${type}`, {
    next: { revalidate: 300, ...options?.next },
  });
}

export async function subscribeNewsletter(
  data: NewsletterFormData,
): Promise<ApiResponse<{ message: string }>> {
  return api.post('/newsletter/subscribe', data);
}
