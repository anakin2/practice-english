const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const usesSupabase = Boolean(url && key)

export async function loadWords() {
  if (!url && !key) {
    const { words } = await import('../words')
    return words
  }
  if (!usesSupabase) throw new Error('Supabase 設定不完整，請聯絡網站管理員。')

  // Supabase limits each response to a page; fetch all pages in stable ID order.
  const words = []
  const pageSize = 500
  for (let offset = 0; ; offset += pageSize) {
    const endpoint = new URL('/rest/v1/words', url)
    endpoint.search = new URLSearchParams({
      select: 'id,word,ipa,meaning,category',
      order: 'id.asc',
      limit: String(pageSize),
      offset: String(offset),
    })
    let response
    try {
      response = await fetch(endpoint, { headers: { apikey: key } })
    } catch {
      throw new Error('無法連線到單字資料庫，請稍後重試。')
    }
    if (!response.ok) throw new Error('單字載入失敗，請稍後重試或聯絡網站管理員。')
    const page = await response.json()
    if (!Array.isArray(page) || page.some(w =>
      !Number.isSafeInteger(w.id) || ['word', 'ipa', 'meaning', 'category'].some(field => typeof w[field] !== 'string')
    )) throw new Error('單字資料格式不正確，請聯絡網站管理員。')
    words.push(...page)
    if (page.length === 0) return words
  }
}
