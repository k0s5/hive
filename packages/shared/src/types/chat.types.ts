// Core chat interface
export interface IChat {
  id: string
  type: ChatType
  name?: string
  description?: string
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  participants?: IChatParticipant[]
  lastMessage?: {
    id: string
    text?: string
    type: string
    userId: string
    createdAt: Date
  }
  unreadCount?: number
  metadata?: IChatMetadata
}

// Chat types enum
export enum ChatType {
  DIRECT = 'direct',
  GROUP = 'group',
}

// Chat participant interface
export interface IChatParticipant {
  id: string
  chatId: string
  userId: string
  role: ParticipantRole
  joinedAt: Date
  leftAt?: Date
  user?: {
    id: string
    username?: string
    firstName?: string
    lastName?: string
    avatar?: string
    isOnline?: boolean
    lastSeen?: Date
  }
}

// Participant roles enum
export enum ParticipantRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

// Chat metadata interface for additional chat information
export interface IChatMetadata {
  // Group chat specific
  isPublic?: boolean
  inviteLink?: string
  memberLimit?: number

  // Chat settings
  muteNotifications?: boolean
  mutedUntil?: Date

  // Privacy settings
  canAddMembers?: boolean
  canChangeInfo?: boolean
  canPinMessages?: boolean

  // Additional data
  theme?: string
  wallpaper?: string
  language?: string

  // Statistics
  messageCount?: number
  mediaCount?: number
  fileCount?: number

  // Archive/folder info
  isArchived?: boolean
  folder?: string

  // Additional JSON data for extensibility
  additionalData?: Record<string, any>
}

// Chat creation DTO
export interface IChatCreate {
  type: ChatType
  name?: string
  description?: string
  avatar?: string
  participantUserIds: string[]
  metadata?: Partial<IChatMetadata>
}

// Chat update DTO
export interface IChatUpdate {
  name?: string
  description?: string
  avatar?: string
  metadata?: Partial<IChatMetadata>
}

// Chat search query interface
export interface IChatSearchQuery {
  query?: string
  type?: ChatType
  userId?: string // to find chats where specific user participates
  hasUnreadMessages?: boolean
  isArchived?: boolean
  dateFrom?: Date
  dateTo?: Date
  limit?: number
  offset?: number
  sortBy?: ChatSortBy
  sortOrder?: SortOrder
}

// Chat sorting options
export enum ChatSortBy {
  LAST_MESSAGE = 'lastMessage',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
  UNREAD_COUNT = 'unreadCount',
}

// Sort order enum
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// Chat list item interface (optimized for chat list display)
export interface IChatListItem {
  id: string
  type: ChatType
  name?: string
  avatar?: string
  lastMessage?: {
    id: string
    text?: string
    type: string
    userId: string
    userName?: string
    createdAt: Date
  }
  unreadCount: number
  isMuted: boolean
  isPinned?: boolean
  isOnline?: boolean // for direct chats
  lastSeen?: Date // for direct chats
  participantCount?: number // for group chats
}

// Chat invitation interface
export interface IChatInvitation {
  id: string
  chatId: string
  inviterUserId: string
  inviteeUserId: string
  inviteCode?: string
  createdAt: Date
  expiresAt?: Date
  isUsed: boolean
  usedAt?: Date
}

// Chat member management DTOs
export interface IAddChatMember {
  chatId: string
  userId: string
  role?: ParticipantRole
}

export interface IRemoveChatMember {
  chatId: string
  userId: string
}

export interface IUpdateChatMemberRole {
  chatId: string
  userId: string
  role: ParticipantRole
}

// Chat notification settings
export interface IChatNotificationSettings {
  chatId: string
  userId: string
  isMuted: boolean
  mutedUntil?: Date
  soundEnabled: boolean
  showPreview: boolean
  mentionsOnly: boolean
}

// Chat draft message interface
export interface IChatDraft {
  chatId: string
  userId: string
  text?: string
  replyToMessageId?: string
  attachments?: string[] // attachment URLs or IDs
  mentions?: string[] // user IDs
  createdAt: Date
  updatedAt: Date
}

// Chat typing indicator interface
export interface IChatTyping {
  chatId: string
  userId: string
  userName: string
  isTyping: boolean
  timestamp: Date
}

// Chat archive/folder management
export interface IChatFolder {
  id: string
  userId: string
  name: string
  color?: string
  icon?: string
  order: number
  chatIds: string[]
  createdAt: Date
  updatedAt: Date
}

// Chat statistics interface
export interface IChatStatistics {
  chatId: string
  messageCount: number
  mediaMessageCount: number
  fileMessageCount: number
  participantCount: number
  averageMessagesPerDay: number
  mostActiveUsers: Array<{
    userId: string
    userName: string
    messageCount: number
  }>
  createdAt: Date
  lastCalculatedAt: Date
}

// Chat backup/export interface
export interface IChatExport {
  chatId: string
  requestedBy: string
  format: ChatExportFormat
  dateFrom?: Date
  dateTo?: Date
  includeMedia: boolean
  status: ChatExportStatus
  downloadUrl?: string
  createdAt: Date
  completedAt?: Date
  expiresAt?: Date
}

export enum ChatExportFormat {
  JSON = 'json',
  HTML = 'html',
  TEXT = 'text',
  PDF = 'pdf',
}

export enum ChatExportStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  EXPIRED = 'expired',
}

// Real-time chat events interfaces
export interface IChatEvent {
  type: ChatEventType
  chatId: string
  userId: string
  timestamp: Date
  data?: any
}

export enum ChatEventType {
  // Participant events
  PARTICIPANT_JOINED = 'participant_joined',
  PARTICIPANT_LEFT = 'participant_left',
  PARTICIPANT_ADDED = 'participant_added',
  PARTICIPANT_REMOVED = 'participant_removed',
  PARTICIPANT_ROLE_CHANGED = 'participant_role_changed',

  // Chat update events
  CHAT_CREATED = 'chat_created',
  CHAT_UPDATED = 'chat_updated',
  CHAT_DELETED = 'chat_deleted',
  CHAT_ARCHIVED = 'chat_archived',
  CHAT_UNARCHIVED = 'chat_unarchived',

  // Message events
  MESSAGE_SENT = 'message_sent',
  MESSAGE_EDITED = 'message_edited',
  MESSAGE_DELETED = 'message_deleted',
  MESSAGE_PINNED = 'message_pinned',
  MESSAGE_UNPINNED = 'message_unpinned',

  // Typing events
  USER_TYPING = 'user_typing',
  USER_STOPPED_TYPING = 'user_stopped_typing',

  // Presence events
  USER_ONLINE = 'user_online',
  USER_OFFLINE = 'user_offline',
}

// Chat permissions interface
export interface IChatPermissions {
  chatId: string
  userId: string
  canSendMessages: boolean
  canSendMedia: boolean
  canAddMembers: boolean
  canRemoveMembers: boolean
  canChangeInfo: boolean
  canPinMessages: boolean
  canDeleteMessages: boolean
  canManageChat: boolean
  canViewMembers: boolean
}

// Helper types for type safety
export type ChatWithParticipants = IChat & {
  participants: IChatParticipant[]
}

export type ChatWithLastMessage = IChat & {
  lastMessage: NonNullable<IChat['lastMessage']>
}

export type DirectChat = IChat & {
  type: ChatType.DIRECT
  participants: [IChatParticipant, IChatParticipant]
}

export type GroupChat = IChat & {
  type: ChatType.GROUP
  name: string
  participants: IChatParticipant[]
}

// Chat validation types
export interface IChatValidation {
  nameMinLength: number
  nameMaxLength: number
  descriptionMaxLength: number
  maxParticipants: number
  maxFileSize: number
  allowedImageTypes: string[]
  allowedFileTypes: string[]
}

// Chat API response types
export interface IChatListResponse {
  chats: IChatListItem[]
  total: number
  hasMore: boolean
  nextOffset?: number
}

export interface IChatResponse {
  chat: IChat
  participants: IChatParticipant[]
  permissions: IChatPermissions
}

export interface IChatMembersResponse {
  participants: IChatParticipant[]
  total: number
  hasMore: boolean
  nextOffset?: number
}
