"use strict";
module.exports = function mimeTypeToEXT(mimeType) {
  switch (mimeType) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "application/pdf":
      return ".pdf";
    case "video/mp4":
      return ".mp4";
    case "audio/wav":
      return ".wav";
    case "audio/mp3":
      return ".mp3";
    case "audio/flac":
        return ".flac";
    case "audio/aiff":
      return ".aiff";
    case 'audio/x-aiff':
      return ".aiff";
    case "audio/ogg":
      return ".ogg"
  }
};