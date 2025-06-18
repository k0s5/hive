export const API_ROUTES = {
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    REFRESH: '/auth/refresh',
    SIGNOUT: '/auth/signout',
    ME: '/auth/me',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    SEARCH: '/users/search',
    SETTINGS: '/users/settings',
  },
  CHATS: {
    BASE: '/chats',
    MESSAGES: (chatId: string) => `/chats/${chatId}/messages`,
    PARTICIPANTS: (chatId: string) => `/chats/${chatId}/participants`,
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
    MARK_READ: '/notifications/mark-read',
    MARK_ALL_READ: '/notifications/mark-all-read',
  },
} as const
