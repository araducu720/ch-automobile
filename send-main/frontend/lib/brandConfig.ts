import { BrandSlug } from '@/types/kyc';

export interface BrandConfig {
  name: string;
  slug: BrandSlug;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  fontFamily: string;
  headerBg: string;
  headerText: string;
  buttonRadius: string;
  cardShadow: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  bgLight: string;
  bgPage: string;
  success: string;
  error: string;
  link: string;
  border: string;
  inputBorder: string;
  inputBg: string;
  inputFocus: string;
  favicon: string;
  meta: {
    title: string;
    description: string;
  };
}

export const brandConfigs: Record<BrandSlug, BrandConfig> = {
  walmart: {
    name: 'Walmart',
    slug: 'walmart',
    primaryColor: '#0071CE',
    secondaryColor: '#FFC220',
    logo: '/brands/walmart-logo.svg',
    fontFamily: '"Bogle", "Helvetica Neue", Helvetica, Arial, sans-serif',
    headerBg: '#0071CE',
    headerText: '#FFFFFF',
    buttonRadius: '4px',
    cardShadow: '0 2px 8px rgba(0,0,0,0.08)',
    accent: '#FFC220',
    textPrimary: '#2E2F32',
    textSecondary: '#6D6E71',
    bgLight: '#F2F8FD',
    bgPage: '#FFFFFF',
    success: '#2A8703',
    error: '#DE1C24',
    link: '#0071CE',
    border: '#E6E7E8',
    inputBorder: '#CBCBCB',
    inputBg: '#FFFFFF',
    inputFocus: '#0071CE',
    favicon: '/brands/walmart-favicon.ico',
    meta: {
      title: 'Walmart - Identity Verification',
      description: 'Complete your identity verification for Walmart Marketplace',
    },
  },

  amazon: {
    name: 'Amazon',
    slug: 'amazon',
    primaryColor: '#232F3E',
    secondaryColor: '#FF9900',
    logo: '/brands/amazon-logo.svg',
    fontFamily: '"Amazon Ember", Arial, sans-serif',
    headerBg: '#232F3E',
    headerText: '#FFFFFF',
    buttonRadius: '8px',
    cardShadow: '0 2px 5px 0 rgba(213,217,217,.5)',
    accent: '#FF9900',
    textPrimary: '#0F1111',
    textSecondary: '#565959',
    bgLight: '#EAEDED',
    bgPage: '#FFFFFF',
    success: '#067D62',
    error: '#CC0C39',
    link: '#007185',
    border: '#D5D9D9',
    inputBorder: '#888C8C',
    inputBg: '#FFFFFF',
    inputFocus: '#E77600',
    favicon: '/brands/amazon-favicon.ico',
    meta: {
      title: 'Amazon - Seller Verification',
      description: 'Verify your identity to sell on Amazon Marketplace',
    },
  },

  dpd: {
    name: 'DPD',
    slug: 'dpd',
    primaryColor: '#DC0032',
    secondaryColor: '#414042',
    logo: '/brands/dpd-logo.svg',
    fontFamily: '"PlutoSans", "Helvetica Neue", Helvetica, Arial, sans-serif',
    headerBg: '#DC0032',
    headerText: '#FFFFFF',
    buttonRadius: '6px',
    cardShadow: '0 1px 3px rgba(0,0,0,0.12)',
    accent: '#DC0032',
    textPrimary: '#414042',
    textSecondary: '#6D6E71',
    bgLight: '#F5F5F5',
    bgPage: '#FAFAFA',
    success: '#4CAF50',
    error: '#DC0032',
    link: '#DC0032',
    border: '#E0E0E0',
    inputBorder: '#CCCCCC',
    inputBg: '#FFFFFF',
    inputFocus: '#DC0032',
    favicon: '/brands/dpd-favicon.ico',
    meta: {
      title: 'DPD - Courier Verification',
      description: 'Verify your identity with DPD delivery services',
    },
  },

  dhl: {
    name: 'DHL',
    slug: 'dhl',
    primaryColor: '#FFCC00',
    secondaryColor: '#D40511',
    logo: '/brands/dhl-logo.svg',
    fontFamily: '"Delivery", Verdana, Arial, sans-serif',
    headerBg: '#FFCC00',
    headerText: '#D40511',
    buttonRadius: '0px',
    cardShadow: '0 2px 4px rgba(0,0,0,0.1)',
    accent: '#D40511',
    textPrimary: '#333333',
    textSecondary: '#666666',
    bgLight: '#FFFBEB',
    bgPage: '#FFFFFF',
    success: '#69B826',
    error: '#D40511',
    link: '#D40511',
    border: '#CCCCCC',
    inputBorder: '#999999',
    inputBg: '#FFFFFF',
    inputFocus: '#D40511',
    favicon: '/brands/dhl-favicon.ico',
    meta: {
      title: 'DHL - Express Verification',
      description: 'Complete identity verification for DHL Express services',
    },
  },
};

export function getBrandConfig(slug: string): BrandConfig | undefined {
  return brandConfigs[slug as BrandSlug];
}

export function getAllBrandSlugs(): BrandSlug[] {
  return Object.keys(brandConfigs) as BrandSlug[];
}
