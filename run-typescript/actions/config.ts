import { Page } from "playwright";
import { linkedInCreatePost, sendMessage, linkedinSearch } from "./linkedin/linkedInCreatePost";
import { sendInstagramMessage, getRecentNotification, instaSearch } from "./instagram/instagramMessage";
import { amazonAddAirpodsToCart } from './amazon/amazonAddHeadphonesToCart'
import { instacartOrder } from './instacart/order'
import { instacartCheckHowFar } from './instacart/checkHowFar'
import { deltaUnitedCheckIn } from './deltaUnited/checkIn';
import { deltaUnitedSearchFlights } from './deltaUnited/searchFlights';

export const DEFAULT_APP: AppName = "instagram";
export const NETWORK_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 5;
export const DO_DELETE_SESSION = false;

export interface AppConfig {
  url: string;
  actions: { [key: string]: (page: Page, params?: any) => Promise<void> };
  params?: any;
}

export const APP_CONFIG: { [key: string]: AppConfig } = {
  amazon: {
    url: "https://www.amazon.com",
    actions: {
      addAirpodsToCart: async (page: Page, params?: any) => {
        await amazonAddAirpodsToCart(page);
      },
      // Add other Amazon actions here
    },
  },
  instagram: {
    url: "https://www.instagram.com",
    actions: {
      sendInstagramMessage: async (page: Page, params?: any) => {
        await sendInstagramMessage(page, params);
      },
      getRecentNotification: async (page: Page, params?: any) => {
        await getRecentNotification(page);
      },
      instaSearch: async (page: Page, params?: any) => {
        await instaSearch(page, params);
      },
      // Add other Instagram actions here
    },
    params: {},
  },
  linkedin: {
    url: "https://www.linkedin.com",
    actions: {
      createPost: async (page: Page, params?: any) => {
        await linkedInCreatePost(page);
      },
      sendMessage: async (page: Page, params?: any) => {
        await sendMessage(page);
      },
      search: async (page: Page, params?: any) => {
        await linkedinSearch(page);
      },
      // Add other LinkedIn actions here
    },
  },
  instacart: {
    url: "https://www.instacart.com",
    actions: {
      order: async (page: Page, params?: any) => {
        await instacartOrder(page, params);
      },
      checkHowFar: async (page: Page, params?: any) => {
        await instacartCheckHowFar(page, params);
      },
    },
  },
  deltaUnited: {
    url: "https://www.delta.com", // Use appropriate URL
    actions: {
      checkIn: async (page: Page, params?: any) => {
        await deltaUnitedCheckIn(page, params);
      },
      searchFlights: async (page: Page, params?: any) => {
        await deltaUnitedSearchFlights(page, params);
      },
    },
  },
};

export type AppName = keyof typeof APP_CONFIG;