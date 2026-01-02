import * as WebBrowser from 'expo-web-browser'
import { useEffect } from 'react'

/**
 * Warm up the browser to improve OAuth flow performance
 */
export function useWarmUpBrowser() {
  useEffect(() => {
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}
