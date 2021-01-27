interface Window {
  _dev?: boolean
  Android: {
    downloadBase64AsMidi: (base64: string, filename: string) => void
    downloadBase64AsWav: (base64: string, filename: string) => void
    onReactLoad: () => void
  }
  webkitAudioContext: typeof AudioContext
  webkitOfflineAudioContext: typeof OfflineAudioContext
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: () => void
}

interface Navigator {
  connection?: { type?: string; effectiveType: "slow-2g" | "2g" | "3g" | "4g" }
}
