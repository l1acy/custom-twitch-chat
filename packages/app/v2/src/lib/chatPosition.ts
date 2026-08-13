// 'right-bottom' | 'right-top' | 'left-bottom' | 'left-top'

import type { ChatPosition } from "@/types/config";

const CHAT_POSITION_CLASSES: Record<ChatPosition, string> = {
  'right-bottom': 'justify-end items-end',
  'right-top': 'justify-start items-end',
  'left-bottom': 'justify-end items-start',
  'left-top': 'justify-start items-start',
};

export const CHAT_VIEW_POSITION_CLASSES: Record<ChatPosition, string> = {
  'right-bottom': 'right-3 bottom-3 flex-col',
  'right-top': 'right-3 top-3 flex-col-reverse',
  'left-bottom': 'left-3 bottom-3 flex-col',
  'left-top': 'left-3 top-3 flex-col-reverse',
};

export default CHAT_POSITION_CLASSES