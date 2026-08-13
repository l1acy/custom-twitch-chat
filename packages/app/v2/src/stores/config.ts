import type { ChatPosition } from "@/types/config";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ChatConfig {
  showBadges: boolean;
  ignoreUsernameColors: boolean;
  ignoreHighlight: boolean;
  chatPosition: ChatPosition;
  customCss: string;
  clientId: string | null;
  clientSecret: string | null;
}

export const defaultConfig: ChatConfig = {
  showBadges: true,
  ignoreUsernameColors: false,
  ignoreHighlight: false,
  chatPosition: 'right-bottom',
  customCss: '',
  clientId: null,
  clientSecret: null
};

interface ConfigStore {
  config: ChatConfig;
  setConfig: (newConfig: Partial<ChatConfig>) => void;
  resetConfig: () => void;
}


export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      setConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      resetConfig: () => set(() => ({ config: defaultConfig })),
    }),
    {
      name: 'custom-twitch-chat-config',
      storage: createJSONStorage(() => localStorage),
    }
  )
);