export const CLUB_POST_ATTACHMENT_PATH_LENGTH = {
  MIN: 1,
  MAX: 19,
} as const;

export const CLUB_POST_ATTACHMENT_COUNT = {
  MIN: 0,
  MAX: 10,
} as const;

export const CLUB_POST_ATTACHMENT_MIME_TYPE = [
  'image/png',
  'image/jpeg',
  'video/mp4',
  'video/quicktime',
];
