// Run in CI before deployment. Never log keys or API response bodies.
const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
if (!url || !key?.startsWith('sb_publishable_')) {
  throw new Error('Public Supabase configuration is missing or invalid')
}
const endpoint = new URL('/rest/v1/words', url)
if (endpoint.protocol !== 'https:') throw new Error('Supabase requires HTTPS')
endpoint.search = new URLSearchParams({ select: 'id,word,ipa,meaning,category', limit: '1' })
const response = await fetch(endpoint, {
  headers: { apikey: key, Prefer: 'count=exact' },
  signal: AbortSignal.timeout(20000),
})
if (!response.ok) throw new Error(`Supabase readiness failed: HTTP ${response.status}`)
const rows = await response.json()
if (!Array.isArray(rows) || rows.some(row =>
  !Number.isSafeInteger(row.id) || ['word', 'ipa', 'meaning', 'category'].some(field => typeof row[field] !== 'string')
)) throw new Error('Supabase returned an unexpected vocabulary format')
const count = response.headers.get('content-range')?.split('/')[1] ?? 'unknown'
console.log(`Supabase anonymous read succeeded; vocabulary rows: ${count}`)
