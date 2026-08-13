export interface ParsedMessage {
  tags: Record<string, string>;
  prefix?: string;
  command: string;
  params: string[];

  channel?: string;
  message?: string;
  username?: string;
}

type EventHandler = (...args: any[]) => void;

interface RawMessage {
  tags: Record<string, string>;
  prefix: string | null;
  command: string;
  params: string[];
  channel?: string;
  message?: string;
}

export class IRCClient {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private readonly room: string;
  private readonly nickname: string;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(url: string, room: string, nickname = 'justinfan12345') {
    this.url = url;
    this.room = room;
    this.nickname = nickname;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log('[IRC] Connected');
      this.reconnectAttempts = 0;
      this.send('CAP REQ :twitch.tv/tags twitch.tv/commands');
      this.send('PASS SCHMOOPIIE');
      this.send(`NICK ${this.nickname}`);
      this.send(`USER ${this.nickname} 8 * :${this.nickname}`);
      this.send(`JOIN #${this.room}`);
    };

    this.ws.onmessage = (event) => {
      const raw = event.data as string;
      const lines = raw.split('\r\n').filter(line => line.length > 0);
      for (const line of lines) {
        this.handleLine(line);
      }
    };

    this.ws.onerror = (error) => {
      this.emit('error', error);
    };

    this.ws.onclose = () => {
      this.emit('close');
      this.tryReconnect();
    };
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(command: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(command);
    }
  }

  on(event: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) handlers.splice(index, 1);
    }
  }

  private handleLine(line: string): void {
    if (line.startsWith('PING')) {
      this.send(line.replace('PING', 'PONG'));
      this.emit('ping');
      return;
    }

    const parsed = this.parseRaw(line);
    if (!parsed) return;

    if (parsed.command === 'PRIVMSG' && parsed.params.length >= 2) {
      const channel = parsed.params[0];
      const message = parsed.params[1];
      this.emit('message', {
        fromUser: this.extractUsername(parsed.prefix),
        channel,
        message,
        tags: parsed.tags,
        raw: line,
      });
      return;
    }

    if (parsed.command === 'CLEARCHAT' || parsed.command === 'USERNOTICE') {
      this.emit('action', parsed.command, parsed.tags, parsed.params);
    }

    this.emit('raw', parsed);
  }

  private parseRaw(line: string): RawMessage | null {
    if (!line.trim()) return null;

    let tags: Record<string, string> = {};
    let prefix: string | null = null;
    let rest = line;


    if (rest.startsWith('@')) {
      const end = rest.indexOf(' ');
      if (end === -1) return null;
      const tagString = rest.slice(1, end);
      rest = rest.slice(end + 1);
      tags = this.parseTags(tagString);
    }

    if (rest.startsWith(':')) {
      const end = rest.indexOf(' ');
      if (end === -1) return null;
      prefix = rest.slice(1, end);
      rest = rest.slice(end + 1);
    }

    const commandEnd = rest.indexOf(' ');
    const command = commandEnd === -1 ? rest : rest.slice(0, commandEnd);
    rest = commandEnd === -1 ? '' : rest.slice(commandEnd + 1);

    const params: string[] = [];
    while (rest.length > 0) {
      if (rest.startsWith(':')) {
        params.push(rest.slice(1));
        break;
      } else {
        const space = rest.indexOf(' ');
        if (space === -1) {
          params.push(rest);
          break;
        } else {
          params.push(rest.slice(0, space));
          rest = rest.slice(space + 1);
        }
      }
    }

    return { tags, prefix, command, params };
  }

  private parseTags(tagString: string): Record<string, string> {
    const tags: Record<string, string> = {};
    const pairs = tagString.split(';');
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        tags[key] = value || '';
      }
    }
    return tags;
  }

  private extractUsername(prefix: string | null): string {
    if (!prefix) return '';
    const exclaim = prefix.indexOf('!');
    return exclaim !== -1 ? prefix.slice(0, exclaim) : prefix;
  }

  private emit(event: string, ...args: any[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(...args);
        } catch (e) {
          console.error(`[IRC] Error in handler for "${event}":`, e);
        }
      }
    }
  }

  private tryReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.emit('error', new Error('Max reconnect attempts reached'));
      return;
    }
    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    setTimeout(() => this.connect(), delay);
  }
}

export default IRCClient;
