import { IncomingHttpHeaders } from "http"

export const getMinutesOffsetFromHeaders = (headers: IncomingHttpHeaders) => {
  const clientOffset = Number(headers["x-minutes-offset"] || 0)

  const serverOffset = new Date().getTimezoneOffset()

  return serverOffset - clientOffset
}
