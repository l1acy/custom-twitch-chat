import "./HomePage.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Input from "../../components/input/Input";
import { Textarea } from "../../components/textarea/Textarea";
import ExampleChat from "../../components/chat/example/ExampleChat";
import spinner from "../../assets/spinner.svg";

type ChatPosition = "left" | "right";
type BotTokenStatus = "default" | "loading" | "successful" | "error";

export default function HomePage() {
  const navigate = useNavigate();

  const [customCss, setCustomCss] = useState<string>("");
  const [chatPosition, setChatPosition] = useState<ChatPosition>("left");
  const [channel, setChannel] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [botTokenStatus, setBotTokenStatus] =
    useState<BotTokenStatus>("default");
  const [botToken, setBotToken] = useState<string | null>(null);

  useEffect(() => {
    const localStorageCss = localStorage.getItem("customCss") ?? "";
    setCustomCss(localStorageCss);
    applyStyles(localStorageCss);
  }, []);

  function openChat() {
    navigate("/chat/" + channel, { replace: false });
  }
  function updateChatPosition(position: ChatPosition) {
    setChatPosition(position);

    const root = document.documentElement;
    if (position === "left") {
      root.style.setProperty("--chatLeft", "24px");
      root.style.setProperty("--chatRight", "auto");
    } else {
      root.style.setProperty("--chatLeft", "auto");
      root.style.setProperty("--chatRight", "24px");
    }
  }
  function applyStyles(styles?: string) {
    let styleElement = document.getElementById("dynamic-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "dynamic-style";
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = styles ?? customCss;
    localStorage.setItem("customCss", styles ?? customCss);
  }
  function getBotToken() {
    setBotTokenStatus("loading");

    async function getData() {
      const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        }),
      });
      if (!response.ok) {
        setBotTokenStatus("error");
      } else {
        setBotTokenStatus("successful");
      }
      const json = await response.json();
      localStorage.setItem("botCredentials", json.access_token.toString());
      localStorage.setItem("clientId", clientId);
    }
    getData();
  }

  return (
    <div className="card">
      <h1>Welcome to CustomTwitchChat</h1>
      <div className="inputWithButton">
        <Input
          id="nameInput"
          label="Channel"
          placeholder="mzlff"
          onChange={(e) => setChannel(e.target.value)}
          value={channel}
        />
        <button onClick={() => openChat()} disabled={!channel}>
          Open chat
        </button>
      </div>
      <hr />
      <div className="inputWithButton">
        <h2>Customization</h2>
        <Textarea
          value={customCss}
          onChange={(e) => setCustomCss(e.target.value)}
          label="Custom CSS"
          placeholder="..."
        ></Textarea>
        <button
          onClick={() => {
            applyStyles();
          }}
        >
          Apply styles
        </button>
        <ExampleChat />
      </div>
      <hr />
      <div className="inputWithButton">
        <h2>Bot settings</h2>
        <p>
          Specify the data of the bot so that you can always receive the latest
          badges from twitch. And also that you would have access to channel
          badges, for example, the badge of a paid subscriber.{" "}
          <a href="https://dev.twitch.tv/console/apps/create">
            Create bot here
          </a>
        </p>
        <Input label="Client Id" type="password" v-model="clientId" />
        <Input label="Client secret" type="password" v-model="clientSecret" />
        {botTokenStatus === "successful" && (
          <span className="successful" v-if="beraerTokenStatus == 'SUCCESSFUL'">
            Token getting successful
          </span>
        )}
        {botTokenStatus === "error" && (
          <span className="warning">
            Cannot get beraer token. Check bot credentials
          </span>
        )}

        <button onClick={() => getBotToken()}>
          {botTokenStatus === "loading" ? (
            <img src={spinner} className="spiner" width="13" height="13" />
          ) : (
            <span>Get beraer token</span>
          )}
        </button>
      </div>
    </div>
  );
}
