export const CLUB_POST_ATTACHMENT_COUNT = {
  MIN: 0,
  MAX: 10,
} as const;

export const CLUB_POST_ATTACHMENT_MIME_TYPE: readonly string[] = [
  'image/png',
  'image/jpeg',
  'video/mp4',
  'video/quicktime',
];
