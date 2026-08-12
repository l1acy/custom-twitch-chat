import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfigStore } from "@/stores/config";
import type { ChatPosition } from "@/types/config";
import { useRef, useState } from "react";

function IndexPage() {
  const config = useConfigStore();

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [customCss, setCustomCss] = useState<string>("");
  const [chatPosition, setChatPosition] = useState<ChatPosition>("left-top");

  function applyConfig() {
    config.setConfig({ customCss, chatPosition });

    if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage({ type: 'RELOAD_CONFIG' }, '*');
    }
  }

  return (
    <div className="max-w-200 mx-auto pt-8 px-2">
      {/* Open chat  */}
      <h1 className="text-2xl font-medium mb-2">
        Welcome to CustomTwitchChat!
      </h1>
      <h2 className="mb-1">Open chat</h2>
      <div className="flex flex-row gap-1">
        <Input placeholder="Channel name" />
        <Button>Go</Button>
      </div>

      <br />

      {/* Customization */}
      <h2 className="mb-1">Customization</h2>
      <iframe src="/preview" className="w-full h-45" ref={iframeRef} />
      <Field className="mb-2">
        <FieldLabel htmlFor="name">Custom CSS</FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
          />
        </InputGroup>
        <FieldDescription>
          <span className="italic text-white">
            Paste code only from trusted sources.
          </span>{" "}
          You can reset it by enter to /reset page.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="name">Messages position</FieldLabel>
        <Select
          value={chatPosition}
          onValueChange={(i) => setChatPosition(i as ChatPosition)}
          items={[
            {
              label: "Left top",
              value: "left-top",
            },
            {
              label: "Left bottom",
              value: "left-bottom",
            },
            {
              label: "Right top",
              value: "right-top",
            },
            {
              label: "Right bottom",
              value: "right-bottom",
            },
          ]}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left-top">Left top</SelectItem>
            <SelectItem value="left-bottom">Left bottom</SelectItem>
            <SelectItem value="right-top">Right top</SelectItem>
            <SelectItem value="right-bottom">Right bottom</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <div className="flex flex-row gap-2">
        <Button variant="default" className="flex-1 my-2" onClick={applyConfig}>
          Apply
        </Button>
        <Button variant="destructive" className="flex-1 my-2">
          Reset
        </Button>
      </div>

      <br />

      {/* Bot settings */}
      <h2 className="mb-1">Bot</h2>
      <Field>
        <FieldLabel>Credentials</FieldLabel>
        <Field orientation="horizontal">
          <Input placeholder="Client ID" />
          <p>:</p>
          <Input placeholder="Client secret" />
        </Field>
        <Button>Authorize</Button>
        <FieldDescription className="flex flex-col gap-1.5">
            Specify the data of the bot so that you can always receive the
            latest badges from twitch. And also that you would have access to
            channel badges, for example, the badge of a paid subscriber.{" "}
            <a
              href="https://dev.twitch.tv/console/apps/create"
              className="text-white underline"
            >
              Create bot here
              </a>
          This data storage locally.
        </FieldDescription>
      </Field>
    </div>
  );
}

export default IndexPage;
