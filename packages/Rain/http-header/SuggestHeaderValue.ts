/**
 * This is just a part of MIMEType, for all of MIMEType,
 * visit https://www.iana.org/assignments/media-types/media-types.xhtml#Connectivity_Standards_Alliance
 */
export const enum Popular_MIMEType {
  /** text */
  html = "text/html",
  xml = "application/xml",
  css = "text/css",
  text = "text/plain",
  javascript = "text/javascript",

  /** font */
  ttf = "font/ttf",
  woff = "font/woff",
  woff2 = "font/woff2",

  /** image */
  jpeg = "image/jpeg",
  png = "image/png",
  svg = "image/svg+xml",
  gif = "image/gif",
  webp = "image/webp",

  /** music */
  wav = "audio/wav",
  ogg = "audio/ogg",

  /** video */
  mp4 = "video/mp4",
  h265 = "video/H265",
  h266 = "video/H266",
  av1 = "video/AV1",

  /** application */
  json = "application/json",
  pdf = "application/pdf",
  excel = "application/vnd.ms-excel",
  ppt = "application/vnd.ms-powerpoint",
  doc = "application/msword",
  docx = "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

  /** form */
  form = "multipart/form-data",

  /** byteranges */
  byte_ranges = "multipart/byteranges",

  /** other */
  octet_stream = "application/octet-stream"
}

export const enum Cache_Control_Suggest {
  no_cache = "no-cache",
  no_store = "no-store",
  private = "private",
  max_age_400 = "max-age=400"
}

export const enum Content_Disposition_Suggest {
  inline = "inline",
  attachment = "attachment"
}

export const enum Content_Encoding_Suggest {
  gzip = "gzip",
  br = "br",
  deflate = "deflate"
}
