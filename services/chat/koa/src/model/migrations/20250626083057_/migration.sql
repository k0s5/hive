-- CreateEnum
CREATE TYPE "ChatType" AS ENUM ('DIRECT', 'GROUP');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('TEXT', 'LINK', 'IMAGE', 'VIDEO', 'AUDIO', 'VOICE', 'DOCUMENT', 'STICKER', 'GIF', 'LOCATION', 'CONTACT', 'POLL', 'SYSTEM', 'SERVICE');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('SENDING', 'SENT', 'DELIVERED', 'READ', 'FAILED', 'DELETED');

-- CreateEnum
CREATE TYPE "AttachmentType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'VOICE', 'STICKER', 'GIF');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "SystemActionType" AS ENUM ('USER_JOINED', 'USER_LEFT', 'USER_ADDED', 'USER_REMOVED', 'CHAT_CREATED', 'CHAT_TITLE_CHANGED', 'CHAT_PHOTO_CHANGED', 'MESSAGE_PINNED', 'MESSAGE_UNPINNED', 'CALL_STARTED', 'CALL_ENDED');

-- CreateEnum
CREATE TYPE "FormattingType" AS ENUM ('BOLD', 'ITALIC', 'UNDERLINE', 'STRIKETHROUGH', 'CODE', 'PRE', 'LINK', 'MENTION', 'HASHTAG', 'SPOILER');

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "type" "ChatType" NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_participants" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "chat_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT,
    "type" "MessageType" NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'SENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "editedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "replyToMessageId" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "type" "AttachmentType" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "caption" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_reactions" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_mentions" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "startIndex" INTEGER NOT NULL,
    "endIndex" INTEGER NOT NULL,

    CONSTRAINT "message_mentions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_read_receipts" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_read_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_forwards" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fromUserId" TEXT NOT NULL,
    "fromChatId" TEXT,
    "fromMessageId" TEXT NOT NULL,
    "forwardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "originalDate" TIMESTAMP(3) NOT NULL,
    "fromUserName" TEXT,
    "fromChatName" TEXT,

    CONSTRAINT "message_forwards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_metadata" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "voiceWaveform" JSONB,
    "voiceDuration" INTEGER,
    "locationLatitude" DOUBLE PRECISION,
    "locationLongitude" DOUBLE PRECISION,
    "locationAccuracy" DOUBLE PRECISION,
    "locationAddress" TEXT,
    "contactPhoneNumber" TEXT,
    "contactFirstName" TEXT,
    "contactLastName" TEXT,
    "contactUserId" TEXT,
    "contactVcard" TEXT,
    "pollQuestion" TEXT,
    "pollIsAnonymous" BOOLEAN,
    "pollIsMultipleChoice" BOOLEAN,
    "pollIsClosed" BOOLEAN,
    "pollCorrectOptionId" TEXT,
    "pollTotalVoters" INTEGER,
    "systemActionType" "SystemActionType",
    "systemActionUserId" TEXT,
    "systemActionTargetUserId" TEXT,
    "systemActionText" TEXT,
    "linkPreviewUrl" TEXT,
    "linkPreviewTitle" TEXT,
    "linkPreviewDescription" TEXT,
    "linkPreviewImageUrl" TEXT,
    "linkPreviewSiteName" TEXT,
    "additionalData" JSONB,

    CONSTRAINT "message_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_poll_options" (
    "id" TEXT NOT NULL,
    "messageMetadataId" TEXT NOT NULL,
    "optionText" TEXT NOT NULL,
    "voterCount" INTEGER NOT NULL DEFAULT 0,
    "voterUserIds" JSONB,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "message_poll_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_formatting_entities" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "type" "FormattingType" NOT NULL,
    "offset" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "url" TEXT,
    "userId" TEXT,
    "language" TEXT,

    CONSTRAINT "message_formatting_entities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chats_type_idx" ON "chats"("type");

-- CreateIndex
CREATE INDEX "chats_createdAt_idx" ON "chats"("createdAt");

-- CreateIndex
CREATE INDEX "chat_participants_userId_idx" ON "chat_participants"("userId");

-- CreateIndex
CREATE INDEX "chat_participants_chatId_idx" ON "chat_participants"("chatId");

-- CreateIndex
CREATE UNIQUE INDEX "chat_participants_chatId_userId_key" ON "chat_participants"("chatId", "userId");

-- CreateIndex
CREATE INDEX "messages_chatId_idx" ON "messages"("chatId");

-- CreateIndex
CREATE INDEX "messages_userId_idx" ON "messages"("userId");

-- CreateIndex
CREATE INDEX "messages_createdAt_idx" ON "messages"("createdAt");

-- CreateIndex
CREATE INDEX "messages_type_idx" ON "messages"("type");

-- CreateIndex
CREATE INDEX "messages_status_idx" ON "messages"("status");

-- CreateIndex
CREATE INDEX "messages_isDeleted_idx" ON "messages"("isDeleted");

-- CreateIndex
CREATE INDEX "attachments_messageId_idx" ON "attachments"("messageId");

-- CreateIndex
CREATE INDEX "attachments_type_idx" ON "attachments"("type");

-- CreateIndex
CREATE INDEX "message_reactions_messageId_idx" ON "message_reactions"("messageId");

-- CreateIndex
CREATE INDEX "message_reactions_userId_idx" ON "message_reactions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "message_reactions_messageId_userId_emoji_key" ON "message_reactions"("messageId", "userId", "emoji");

-- CreateIndex
CREATE INDEX "message_mentions_messageId_idx" ON "message_mentions"("messageId");

-- CreateIndex
CREATE INDEX "message_mentions_userId_idx" ON "message_mentions"("userId");

-- CreateIndex
CREATE INDEX "message_read_receipts_messageId_idx" ON "message_read_receipts"("messageId");

-- CreateIndex
CREATE INDEX "message_read_receipts_userId_idx" ON "message_read_receipts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "message_read_receipts_messageId_userId_key" ON "message_read_receipts"("messageId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "message_forwards_messageId_key" ON "message_forwards"("messageId");

-- CreateIndex
CREATE INDEX "message_forwards_fromUserId_idx" ON "message_forwards"("fromUserId");

-- CreateIndex
CREATE INDEX "message_forwards_fromChatId_idx" ON "message_forwards"("fromChatId");

-- CreateIndex
CREATE UNIQUE INDEX "message_metadata_messageId_key" ON "message_metadata"("messageId");

-- CreateIndex
CREATE INDEX "message_poll_options_messageMetadataId_idx" ON "message_poll_options"("messageMetadataId");

-- CreateIndex
CREATE INDEX "message_formatting_entities_messageId_idx" ON "message_formatting_entities"("messageId");

-- AddForeignKey
ALTER TABLE "chat_participants" ADD CONSTRAINT "chat_participants_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_replyToMessageId_fkey" FOREIGN KEY ("replyToMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_reactions" ADD CONSTRAINT "message_reactions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_mentions" ADD CONSTRAINT "message_mentions_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_read_receipts" ADD CONSTRAINT "message_read_receipts_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_forwards" ADD CONSTRAINT "message_forwards_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_metadata" ADD CONSTRAINT "message_metadata_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_poll_options" ADD CONSTRAINT "message_poll_options_messageMetadataId_fkey" FOREIGN KEY ("messageMetadataId") REFERENCES "message_metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_formatting_entities" ADD CONSTRAINT "message_formatting_entities_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
