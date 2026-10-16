import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// Admin sessions stay in memory: closing/reloading the page requires signing in again.
export const supabase = url && key ? createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: true, detectSessionInUrl: false },
}) : null

export async function saveWord(id, values) {
  if (!supabase) throw new Error('尚未設定 Supabase 連線。')
  const query = id === null
    ? supabase.from('words').insert(values)
    : supabase.from('words').update(values).eq('id', id)
  const { data, error } = await query.select('id').single()
  if (error) throw new Error(error.code === '23505' ? '這個英文單字已經存在。' : '儲存失敗，請確認管理員權限、登入狀態與欄位內容。')
  return data
}

export async function deleteWord(id) {
  if (!supabase) throw new Error('尚未設定 Supabase 連線。')
  const { data, error } = await supabase.from('words').delete().eq('id', id).select('id').single()
  if (error || !data) throw new Error('刪除失敗，請確認管理員權限與登入狀態。')
}
