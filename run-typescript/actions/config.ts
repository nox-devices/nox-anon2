import { Page } from "playwright";
import { linkedInCreatePost, sendMessage } from "./linkedin/linkedInCreatePost";
import { instagramNavigateToMessages, getRecentNotification } from "./instagram/instagramMessage";
import { amazonAddAirpodsToCart } from './amazon/amazonAddHeadphonesToCart'

export const DEFAULT_APP: AppName = "instagram";
export const NETWORK_TIMEOUT = 10000; // 10 seconds
export const MAX_RETRIES = 5;
export const DO_DELETE_SESSION = false;

export interface AppConfig {
  url: string;
  action: (page: Page) => Promise<void>;
}

export const APP_CONFIG: { [key: string]: AppConfig } = {
  amazon: {
    url: "https://www.amazon.com",
    action: amazonAddAirpodsToCart,
  },
  instagram: {
    url: "https://www.instagram.com",
    action: getRecentNotification,
  },
  linkedin: {
    url: "https://www.linkedin.com",
    action: sendMessage,
  },
  // Add other apps here, for example:
  // twitter: {
  //   url: "https://twitter.com",
  //   action: twitterPostTweet
  // },
};

export type AppName = keyof typeof APP_CONFIG;
