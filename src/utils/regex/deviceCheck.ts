export const getDeviceInfo = () => {
  if (typeof navigator === "undefined") {
    return {
      isSafari: false,
      isChrome: false,
      isMobile: false,
      isTablet: false,
      isMobileOrTablet: false,
    }
  }

  const userAgent = navigator.userAgent.toLowerCase()

  const isSafari =
    userAgent.includes("safari") &&
    !userAgent.includes("chrome") &&
    !userAgent.includes("android")

  const isChrome =
    userAgent.includes("chrome") &&
    !userAgent.includes("edg") &&
    !userAgent.includes("opr")

  const isMobile = /iphone|ipod|android.*mobile|windows phone/.test(userAgent)

  const isTablet =
    /ipad/.test(userAgent) ||
    /android(?!.*mobile)|tablet/.test(userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)

  return {
    isSafari,
    isChrome,
    isMobile,
    isTablet,
    isMobileOrTablet: isMobile || isTablet,
  }
}