import type { Industry } from './accounts.js';

// Keyword templates by industry and ad group type
export const KEYWORD_TEMPLATES: Record<Industry, Record<string, string[]>> = {
  ecommerce: {
    default: [
      'buy {product} online',
      '{product} for sale',
      'best {product}',
      'cheap {product}',
      '{product} deals',
      '{product} discount',
      'shop {product}',
      '{product} store',
      '{product} price',
      '{product} reviews',
    ],
    products: [
      'laptop',
      'smartphone',
      'headphones',
      'tablet',
      'camera',
      'watch',
      'furniture',
      'clothing',
      'shoes',
      'accessories',
    ],
  },

  saas: {
    default: [
      '{product} software',
      'best {product} tool',
      '{product} platform',
      '{product} for business',
      '{product} solution',
      'cloud {product}',
      '{product} app',
      '{product} system',
      'enterprise {product}',
      '{product} automation',
    ],
    products: [
      'project management',
      'CRM',
      'analytics',
      'marketing',
      'HR',
      'accounting',
      'collaboration',
      'workflow',
      'reporting',
      'integration',
    ],
  },

  local_services: {
    default: [
      '{service} near me',
      '{service} in {location}',
      'emergency {service}',
      '24 hour {service}',
      'best {service}',
      'affordable {service}',
      '{service} company',
      'local {service}',
      '{service} services',
      '{service} repair',
    ],
    services: [
      'plumber',
      'electrician',
      'HVAC',
      'roofing',
      'landscaping',
      'cleaning',
      'handyman',
      'pest control',
      'locksmith',
      'appliance repair',
    ],
  },

  travel: {
    default: [
      '{destination} vacation',
      'flights to {destination}',
      '{destination} hotels',
      '{destination} travel deals',
      '{destination} packages',
      'cheap {destination} trips',
      '{destination} resorts',
      'best time to visit {destination}',
      '{destination} tours',
      '{destination} all inclusive',
    ],
    destinations: [
      'Hawaii',
      'Cancun',
      'Paris',
      'Caribbean',
      'Italy',
      'Japan',
      'Costa Rica',
      'Greece',
      'Bali',
      'London',
    ],
  },

  finance: {
    default: [
      '{product} account',
      'best {product} rates',
      '{product} for beginners',
      'how to {product}',
      '{product} calculator',
      '{product} advisor',
      '{product} services',
      'online {product}',
      '{product} tips',
      '{product} comparison',
    ],
    products: [
      'savings',
      'investment',
      'retirement',
      'mortgage',
      'credit card',
      'loan',
      'insurance',
      'trading',
      'banking',
      'wealth management',
    ],
  },
};

// Generate keywords for an ad group
export function generateKeywordsForAdGroup(
  industry: Industry,
  adGroupName: string,
  count: number,
  pickFn: <T>(arr: readonly T[]) => T
): string[] {
  const templates = KEYWORD_TEMPLATES[industry];
  const patterns = templates.default;
  const substitutes = Object.values(templates).find(Array.isArray) || ['product'];

  const keywords: string[] = [];
  for (let i = 0; i < count; i++) {
    const pattern = pickFn(patterns);
    const substitute = pickFn(substitutes as string[]);
    const keyword = pattern
      .replace('{product}', substitute)
      .replace('{service}', substitute)
      .replace('{destination}', substitute)
      .replace('{location}', 'downtown');
    keywords.push(keyword);
  }

  return [...new Set(keywords)]; // Remove duplicates
}
