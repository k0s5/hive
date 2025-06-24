// Основной интерфейс сообщения
export interface IMessage {
  id: string
  chatId: string
  userId: string
  text?: string
  type: MessageType
  status: MessageStatus
  createdAt: Date
  updatedAt?: Date
  editedAt?: Date
  deletedAt?: Date
  replyToMessageId?: string
  forwardedFrom?: IForwardInfo
  attachments?: IAttachment[]
  reactions?: IReaction[]
  mentions?: IMention[]
  isPinned?: boolean
  isEdited?: boolean
  isDeleted?: boolean
  readBy?: IReadReceipt[]
  metadata?: IMessageMetadata
}

export interface IMessageText extends IMessage {
  text: string
  type: MessageType.TEXT
}

// Типы сообщений
export enum MessageType {
  TEXT = 'text',
  LINK = 'link',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  VOICE = 'voice',
  DOCUMENT = 'document',
  STICKER = 'sticker',
  GIF = 'gif',
  LOCATION = 'location',
  CONTACT = 'contact',
  POLL = 'poll',
  SYSTEM = 'system',
  SERVICE = 'service',
}

// Статусы сообщений
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
  DELETED = 'deleted',
}

// Информация о пересланном сообщении
export interface IForwardInfo {
  fromUserId: string
  fromChatId?: string
  fromMessageId: string
  forwardedAt: Date
  originalDate: Date
  fromUserName?: string
  fromChatName?: string
}

// Вложения
export interface IAttachment {
  id: string
  type: AttachmentType
  url: string
  thumbnailUrl?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  width?: number
  height?: number
  duration?: number // для видео/аудио в секундах
  caption?: string
  metadata?: Record<string, any>
}

export enum AttachmentType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  VOICE = 'voice',
  STICKER = 'sticker',
  GIF = 'gif',
}

// Реакции на сообщения
export interface IReaction {
  emoji: string
  count: number
  users: string[] // массив userId
  hasCurrentUserReacted: boolean
}

// Упоминания пользователей
export interface IMention {
  userId: string
  username: string
  startIndex: number
  endIndex: number
}

// Информация о прочтении
export interface IReadReceipt {
  userId: string
  readAt: Date
}

// Метаданные сообщения
export interface IMessageMetadata {
  // Для голосовых сообщений
  voiceWaveform?: number[]
  voiceDuration?: number

  // Для локации
  location?: {
    latitude: number
    longitude: number
    accuracy?: number
    address?: string
  }

  // Для контактов
  contact?: {
    phoneNumber: string
    firstName: string
    lastName?: string
    userId?: string
    vcard?: string
  }

  // Для опросов
  poll?: {
    question: string
    options: IPollOption[]
    isAnonymous: boolean
    isMultipleChoice: boolean
    isClosed: boolean
    correctOptionId?: string
    totalVoters: number
  }

  // Для системных сообщений
  systemAction?: {
    type: SystemActionType
    userId?: string
    targetUserId?: string
    text?: string
  }

  // Дополнительные поля
  linkPreview?: ILinkPreview
  formattingEntities?: IFormattingEntity[]
}

// Опции в опросе
export interface IPollOption {
  id: string
  text: string
  voterCount: number
  voterUserIds?: string[]
  isCorrect?: boolean
}

// Типы системных действий
export enum SystemActionType {
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  USER_ADDED = 'user_added',
  USER_REMOVED = 'user_removed',
  CHAT_CREATED = 'chat_created',
  CHAT_TITLE_CHANGED = 'chat_title_changed',
  CHAT_PHOTO_CHANGED = 'chat_photo_changed',
  MESSAGE_PINNED = 'message_pinned',
  MESSAGE_UNPINNED = 'message_unpinned',
  CALL_STARTED = 'call_started',
  CALL_ENDED = 'call_ended',
}

// Превью ссылок
export interface ILinkPreview {
  url: string
  title?: string
  description?: string
  imageUrl?: string
  siteName?: string
}

// Форматирование текста
export interface IFormattingEntity {
  type: FormattingType
  offset: number
  length: number
  url?: string // для ссылок
  userId?: string // для упоминаний
  language?: string // для кода
}

export enum FormattingType {
  BOLD = 'bold',
  ITALIC = 'italic',
  UNDERLINE = 'underline',
  STRIKETHROUGH = 'strikethrough',
  CODE = 'code',
  PRE = 'pre',
  LINK = 'link',
  MENTION = 'mention',
  HASHTAG = 'hashtag',
  SPOILER = 'spoiler',
}

// Вспомогательные типы для работы с сообщениями
export interface IMessageDraft {
  chatId: string
  text?: string
  replyToMessageId?: string
  attachments?: IAttachment[]
  mentions?: string[] // userId[]
}

export interface IMessageUpdate {
  text?: string
  attachments?: IAttachment[]
  mentions?: IMention[]
  isEdited: true
  editedAt: Date
}

export interface IMessageSearchQuery {
  text?: string
  chatId?: string
  userId?: string
  dateFrom?: Date
  dateTo?: Date
  hasAttachments?: boolean
  attachmentTypes?: AttachmentType[]
  limit?: number
  offset?: number
}
