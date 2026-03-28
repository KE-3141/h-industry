import { joinURL } from 'ufo'

/** `public/` 配下へのパスを `app.baseURL` 付きで返す */
export function usePublicUrl(path: string) {
  const base = useRuntimeConfig().app.baseURL || '/'
  const normalized = path.replace(/^\//, '')
  return joinURL(base, normalized)
}
