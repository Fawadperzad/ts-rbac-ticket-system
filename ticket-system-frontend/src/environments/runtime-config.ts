export interface RuntimeConfig {
  apiUrl?: string;
}

export const runtimeConfig: RuntimeConfig = {
  apiUrl: (window as Window & { __APP_CONFIG__?: RuntimeConfig }).__APP_CONFIG__?.apiUrl
};
