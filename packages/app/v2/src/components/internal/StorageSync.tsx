import { useConfigStore } from "@/stores/config";
import { useEffect } from "react";

function StorageSync() {
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'chatConfig' && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          const newConfig = parsed.state?.config;
          if (newConfig) {
            useConfigStore.setState({ config: newConfig });
          }
        } catch (e) {
          console.warn('An error occurred while parsing config from localStorage: ', e);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return null;
}

export default StorageSync
