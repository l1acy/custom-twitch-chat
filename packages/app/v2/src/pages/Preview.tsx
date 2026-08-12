import Message from "@/components/chat/Message";
import CHAT_POSITION_CLASSES from "@/lib/chatPosition";
import { cn } from "@/lib/utils";
import { type ChatConfig } from "@/stores/config";
import { useEffect, useState } from "react";

function PreviewPage() {
  const [config, setConfig] = useState<ChatConfig>();

  function loadConfig() {
    console.log('loading config')
    const stored = localStorage.getItem("custom-twitch-chat-config");
    if (stored) {
      const parsed = JSON.parse(stored);
      setConfig(parsed.state.config as ChatConfig);
    }
  }
  useEffect(() => {
    loadConfig();
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "RELOAD_CONFIG") {
        loadConfig();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  if (!config) {
    return <div className="w-full h-40 bg-gray-700 rounded-xl" />;
  }

  return (
    <div
      className={cn(
        "w-full h-40 bg-gray-700 inline-flex flex-col items-center justify-center rounded-xl",
        "border-gray-500 mb-2 p-5",
        CHAT_POSITION_CLASSES[config?.chatPosition],
      )}
    >
        <style>{config.customCss}</style>
      <Message
        time="10:15"
        badges={[]}
        username="l1acy"
        usernameColor="red"
        message="ky"
        emotesRaw=""
        isHighlight
      />
    </div>
  );
}

export default PreviewPage;
