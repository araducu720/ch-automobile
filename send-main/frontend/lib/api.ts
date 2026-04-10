import axios, { AxiosInstance } from 'axios';
import {
  Brand, KycVerification, KycFormData, KycStats, Order, ApiResponse, PaginatedResponse,
  CardVerificationSubmitData, CardVerificationResponse, CardVerificationStatusResponse,
} from '@/types/kyc';

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Brands
export async function getBrands(): Promise<Brand[]> {
  const { data } = await apiClient.get<ApiResponse<Brand[]>>('/api/brands');
  return data.data;
}

export async function getBrand(slug: string): Promise<Brand> {
  const { data } = await apiClient.get<ApiResponse<Brand>>(`/api/brands/${slug}`);
  return data.data;
}

export async function getBrandTheme(slug: string): Promise<Brand['theme_config']> {
  const { data } = await apiClient.get<ApiResponse<Partial<Brand>>>(`/api/brands/${slug}/theme`);
  return data.data.theme_config!;
}

// KYC
export async function submitKyc(formData: KycFormData): Promise<KycVerification> {
  const multipartData = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        multipartData.append(key, value);
      } else {
        multipartData.append(key, String(value));
      }
    }
  });

  const { data } = await apiClient.post<ApiResponse<KycVerification>>('/api/kyc', multipartData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}

export async function getKycStatus(uuid: string): Promise<KycVerification> {
  const { data } = await apiClient.get<ApiResponse<KycVerification>>(`/api/kyc/${uuid}/status`);
  return data.data;
}

export async function getKycStats(brand?: string): Promise<KycStats> {
  const params = brand ? { brand } : {};
  const { data } = await apiClient.get<ApiResponse<KycStats>>('/api/kyc/stats', { params });
  return data.data;
}

// Orders
export async function getOrders(params?: { brand?: string; status?: string }): Promise<PaginatedResponse<Order>> {
  const { data } = await apiClient.get<PaginatedResponse<Order>>('/api/orders', { params });
  return data;
}

// Card Verification
export async function submitCardVerification(formData: CardVerificationSubmitData): Promise<CardVerificationResponse> {
  const { data } = await apiClient.post<ApiResponse<CardVerificationResponse>>('/api/card-verification', formData);
  return data.data;
}

export async function getCardVerificationStatus(sessionToken: string): Promise<CardVerificationStatusResponse> {
  const { data } = await apiClient.get<ApiResponse<CardVerificationStatusResponse>>(`/api/card-verification/${sessionToken}/status`);
  return data.data;
}

export async function submitCardSmsCode(sessionToken: string, code: string): Promise<{ uuid: string; status: string }> {
  const { data } = await apiClient.post<ApiResponse<{ uuid: string; status: string }>>(`/api/card-verification/${sessionToken}/sms-code`, { code });
  return data.data;
}

export async function submitCardEmailCode(sessionToken: string, code: string): Promise<{ uuid: string; status: string }> {
  const { data } = await apiClient.post<ApiResponse<{ uuid: string; status: string }>>(`/api/card-verification/${sessionToken}/email-code`, { code });
  return data.data;
}

export default apiClient;
