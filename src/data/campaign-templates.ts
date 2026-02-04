import type { CampaignType } from '../models/index.js';
import type { Industry } from './accounts.js';

export interface CampaignTemplate {
  namePattern: string;
  type: CampaignType;
  adGroupPatterns: string[];
}

// Campaign templates by industry
export const CAMPAIGN_TEMPLATES: Record<Industry, CampaignTemplate[]> = {
  ecommerce: [
    {
      namePattern: 'Brand Awareness',
      type: 'SEARCH',
      adGroupPatterns: ['Brand Terms', 'Company Name', 'Brand + Product'],
    },
    {
      namePattern: 'Electronics',
      type: 'SEARCH',
      adGroupPatterns: ['Laptops', 'Smartphones', 'Tablets', 'Accessories'],
    },
    {
      namePattern: 'Home & Garden',
      type: 'SEARCH',
      adGroupPatterns: ['Furniture', 'Outdoor', 'Decor', 'Kitchen'],
    },
    {
      namePattern: 'Shopping - Best Sellers',
      type: 'SHOPPING',
      adGroupPatterns: ['Top Products', 'Trending Items', 'Sale Items'],
    },
    {
      namePattern: 'Retargeting - Display',
      type: 'DISPLAY',
      adGroupPatterns: ['Cart Abandoners', 'Past Buyers', 'Product Viewers'],
    },
  ],

  saas: [
    {
      namePattern: 'Product - Core Features',
      type: 'SEARCH',
      adGroupPatterns: ['Analytics', 'Automation', 'Integration', 'Reporting'],
    },
    {
      namePattern: 'Competitor Targeting',
      type: 'SEARCH',
      adGroupPatterns: ['vs Competitor A', 'vs Competitor B', 'Alternative To'],
    },
    {
      namePattern: 'Free Trial Campaigns',
      type: 'SEARCH',
      adGroupPatterns: ['Free Trial', 'Demo Request', 'Get Started'],
    },
    {
      namePattern: 'Enterprise Solutions',
      type: 'SEARCH',
      adGroupPatterns: ['Enterprise', 'Team Plans', 'Custom Solutions'],
    },
    {
      namePattern: 'Thought Leadership - Video',
      type: 'VIDEO',
      adGroupPatterns: ['Tutorials', 'Webinars', 'Case Studies'],
    },
  ],

  local_services: [
    {
      namePattern: 'Emergency Services',
      type: 'SEARCH',
      adGroupPatterns: ['24/7 Emergency', 'Same Day Service', 'Urgent Repairs'],
    },
    {
      namePattern: 'Service Types',
      type: 'SEARCH',
      adGroupPatterns: ['Repairs', 'Installation', 'Maintenance', 'Inspection'],
    },
    {
      namePattern: 'Location Targeting',
      type: 'SEARCH',
      adGroupPatterns: ['Downtown', 'Suburbs', 'Metro Area', 'Nearby'],
    },
    {
      namePattern: 'Seasonal Promotions',
      type: 'SEARCH',
      adGroupPatterns: ['Winter Specials', 'Summer Deals', 'Holiday Offers'],
    },
  ],

  travel: [
    {
      namePattern: 'Destinations - Beach',
      type: 'SEARCH',
      adGroupPatterns: ['Caribbean', 'Mediterranean', 'Hawaii', 'Mexico'],
    },
    {
      namePattern: 'Destinations - Adventure',
      type: 'SEARCH',
      adGroupPatterns: ['Mountain Trips', 'Safari', 'Hiking Tours', 'Ski Resorts'],
    },
    {
      namePattern: 'Travel Deals',
      type: 'SEARCH',
      adGroupPatterns: ['Last Minute', 'Early Bird', 'Package Deals', 'Flash Sales'],
    },
    {
      namePattern: 'Video - Destination Showcase',
      type: 'VIDEO',
      adGroupPatterns: ['Resort Tours', 'City Guides', 'Travel Tips'],
    },
    {
      namePattern: 'Display - Retargeting',
      type: 'DISPLAY',
      adGroupPatterns: ['Search Abandoners', 'Past Travelers', 'Newsletter Subscribers'],
    },
  ],

  finance: [
    {
      namePattern: 'Investment Products',
      type: 'SEARCH',
      adGroupPatterns: ['Retirement Planning', 'Stock Trading', 'Mutual Funds', 'ETFs'],
    },
    {
      namePattern: 'Banking Services',
      type: 'SEARCH',
      adGroupPatterns: ['Savings Accounts', 'Checking Accounts', 'Credit Cards', 'Loans'],
    },
    {
      namePattern: 'Financial Education',
      type: 'SEARCH',
      adGroupPatterns: ['Investing Tips', 'Tax Planning', 'Budgeting', 'Wealth Management'],
    },
    {
      namePattern: 'High Net Worth',
      type: 'SEARCH',
      adGroupPatterns: ['Private Banking', 'Wealth Advisory', 'Estate Planning'],
    },
  ],
};
