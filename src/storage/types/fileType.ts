export const FileType = {
  JPG: '.jpg',
  JPEG: '.jpeg',
  PNG: '.png',
  MP4: '.mp4',
  MOV: '.mov',
  AVI: '.avi',
  GIF: '.gif',
} as const;

export type FileType = (typeof FileType)[keyof typeof FileType];
