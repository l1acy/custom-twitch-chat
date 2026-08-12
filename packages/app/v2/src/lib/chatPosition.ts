// 'right-bottom' | 'right-top' | 'left-bottom' | 'left-top'

import type { ChatPosition } from "@/types/config";

const CHAT_POSITION_CLASSES: Record<ChatPosition, string> = {
  'right-bottom': 'justify-end items-end',
  'right-top': 'justify-start items-end',
  'left-bottom': 'justify-end items-start',
  'left-top': 'justify-start items-start',
};

export default CHAT_POSITION_CLASSES