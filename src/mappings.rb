module FORMATS
  IMAGE_FORMAT = {
    "apng" => "image/apng",
    "avif" => "image/avif",
    "gif"  => "image/gif",
    "jpg"  => "image/jpeg",
    "jpeg" => "image/jpeg",
    "jpe"  => "image/jpeg",
    "jfif" => "image/jpeg",
    "png"  => "image/png",
    "svg"  => "image/svg+xml",
    "webp" => "image/webp"
  }
  VIDEO_FORMAT = {
    "mp4"  => "video/mp4",
    "ogg"  => "video/ogg",
    "webm" => "video/webm"
  }
  AUDIO_FORMAT = {
    "mp3"  => "audio/mpeg",
    "mp4"  => "audio/mp4",
    "wav"  => "audio/wav",
    "webm" => "audio/webm",
    "aac"  => "audio/aac",
    "flac" => "audio/flac",
    "ogg"  => "audio/ogg"
  }
  DOCUMENT_FORMAT = {
    "text" => "text/plain",
    "pdf"  => "application/pdf",
    "rar"  => "application/vnd.rar",
    "zip"  => "application/zip",
    "tar"  => "application/x-tar",
    "xml"  => "application/xml"
  }
  MEDIA_FORMATS = {
    "image" => IMAGE_FORMAT,
    "audio" => AUDIO_FORMAT,
    "video" => VIDEO_FORMAT,
    "document" => DOCUMENT_FORMAT
  }
end