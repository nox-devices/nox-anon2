import { Page } from "playwright";
import { linkedInCreatePost, sendMessage, linkedinSearch } from "./linkedin/linkedInCreatePost";
import { sendInstagramMessage, getRecentNotification, instaSearch } from "./instagram/instagramMessage";
import { amazonAddAirpodsToCart } from './amazon/amazonAddHeadphonesToCart'

export const DEFAULT_APP: AppName = "instagram";
export const NETWORK_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 5;
export const DO_DELETE_SESSION = false;

export interface AppConfig {
  url: string;
  actions: { [key: string]: (page: Page) => Promise<void> };
  params?: any;
}

export const APP_CONFIG: { [key: string]: AppConfig } = {
  amazon: {
    url: "https://www.amazon.com",
    actions: {
      addAirpodsToCart: (page: Page, params?: any) => amazonAddAirpodsToCart(page, params),
      // Add other Amazon actions here
    },
  },
  instagram: {
    url: "https://www.instagram.com",
    actions: {
      sendInstagramMessage: (page: Page, params?: any) => sendInstagramMessage(page, params),
      getRecentNotification: (page: Page, params?: any) => getRecentNotification(page, params),
      instaSearch: (page: Page, params?: any) => instaSearch(page, params),
      // Add other Instagram actions here
    },
    params: {},
  },
  linkedin: {
    url: "https://www.linkedin.com",
    actions: {
      createPost: (page: Page, params?: any) => linkedInCreatePost(page, params),
      sendMessage: (page: Page, params?: any) => sendMessage(page, params),
      search: (page: Page, params?: any) => linkedinSearch(page, params),
      // Add other LinkedIn actions here
    },
  },
};


export type AppName = keyof typeof APP_CONFIG;
