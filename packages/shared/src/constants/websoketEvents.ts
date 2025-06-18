export const WEBSOCKET_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',

  // Messages
  SEND_MESSAGE: 'send_message',
  RECEIVE_MESSAGE: 'receive_message',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_UPDATED: 'message_updated',
  MESSAGE_DELETED: 'message_deleted',

  // Typing
  TYPING_START: 'typing_start',
  TYPING_STOP: 'typing_stop',
  USER_TYPING: 'user_typing',

  // User status
  USER_ONLINE: 'user_online',
  USER_OFFLINE: 'user_offline',

  // Chat events
  CHAT_CREATED: 'chat_created',
  CHAT_UPDATED: 'chat_updated',
  USER_JOINED_CHAT: 'user_joined_chat',
  USER_LEFT_CHAT: 'user_left_chat',

  // Notifications
  NEW_NOTIFICATION: 'new_notification',
} as const
