<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase, saveWord, deleteWord } from '../services/supabase'
import { loadWords } from '../services/vocabulary'

const user = ref(null)
const email = ref('')
const password = ref('')
const busy = ref(false)
const loading = ref(false)
const error = ref('')
const notice = ref('')
const words = ref([])
const search = ref('')
const editingId = ref(null)
const form = ref(blankWord())
const isAdmin = computed(() => user.value?.app_metadata?.role === 'word_admin')
const categories = computed(() => [...new Set(words.value.map(w => w.category))])
const filtered = computed(() => words.value.filter(w => `${w.word} ${w.meaning} ${w.category}`.toLowerCase().includes(search.value.trim().toLowerCase())))
function blankWord() { return { word: '', ipa: '', meaning: '', category: '' } }
function resetForm() { editingId.value = null; form.value = blankWord() }
const subscription = supabase?.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null
  if (!session) { words.value = []; resetForm() }
}).data.subscription
onBeforeUnmount(() => subscription?.unsubscribe())
watch(isAdmin, async allowed => { if (allowed) await refresh() })

async function login() {
  busy.value = true; error.value = ''; notice.value = ''
  try {
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.value.trim(), password: password.value })
    if (authError) throw new Error('登入失敗，請確認電子郵件、密碼及帳號是否已啟用。')
    const { data, error: verifyError } = await supabase.auth.getUser()
    if (verifyError) { await supabase.auth.signOut(); throw new Error('無法驗證登入狀態，請重新登入。') }
    user.value = data.user
  } catch (e) { error.value = e.message }
  finally { password.value = ''; busy.value = false }
}
async function logout() {
  busy.value = true; error.value = ''; notice.value = ''
  try {
    const { error: authError } = await supabase.auth.signOut({ scope: 'local' })
    if (authError) throw new Error('登出失敗，請重試或關閉此頁。')
    user.value = null; words.value = []; resetForm()
  } catch (e) { error.value = e.message }
  finally { busy.value = false }
}
async function refresh() {
  loading.value = true; error.value = ''
  try { words.value = await loadWords() }
  catch (e) { error.value = e.message }
  finally { loading.value = false }
}
function edit(word) {
  editingId.value = word.id
  form.value = Object.fromEntries(Object.keys(blankWord()).map(key => [key, word[key]]))
  error.value = ''; notice.value = ''
  document.getElementById('word-input')?.focus()
}
async function save() {
  if (!isAdmin.value || busy.value) return
  busy.value = true; error.value = ''; notice.value = ''
  try {
    const values = Object.fromEntries(Object.entries(form.value).map(([key, value]) => [key, value.trim()]))
    if (Object.values(values).some(value => !value)) throw new Error('請填寫所有欄位。')
    await saveWord(editingId.value, values)
    resetForm(); notice.value = '單字已儲存，公開頁重新整理後即可看到更新。'
    await refresh()
  } catch (e) { error.value = e.message }
  finally { busy.value = false }
}
async function remove(word) {
  if (!isAdmin.value || busy.value || !window.confirm(`確定刪除「${word.word}」？此操作無法復原。`)) return
  busy.value = true; error.value = ''; notice.value = ''
  try {
    await deleteWord(word.id)
    if (editingId.value === word.id) resetForm()
    notice.value = '單字已刪除。'; await refresh()
  } catch (e) { error.value = e.message }
  finally { busy.value = false }
}
</script>

<template>
  <section class="admin-page">
    <div class="admin-heading"><div><span class="section-eyebrow">WORD GARDEN ADMIN</span><h1>單字管理</h1></div><RouterLink to="/">← 回單字花園</RouterLink></div>
    <p v-if="error" class="notice" role="alert">{{ error }}</p>
    <p v-if="notice" class="admin-success" role="status">{{ notice }}</p>
    <p v-if="!supabase" class="notice">尚未設定 Supabase，請先完成部署連線設定。</p>
    <form v-else-if="!user" class="admin-panel login-panel" @submit.prevent="login">
      <h2>管理員登入</h2><p>使用管理員電子郵件與密碼登入。重新整理頁面後需再次登入。</p>
      <label>電子郵件<input v-model="email" type="email" autocomplete="username" required :disabled="busy"></label>
      <label>密碼<input v-model="password" type="password" autocomplete="current-password" required :disabled="busy"></label>
      <button class="admin-primary" :disabled="busy">{{ busy ? '登入中…' : '登入' }}</button>
    </form>
    <template v-else>
      <div class="admin-account"><span>{{ user.email }}</span><button :disabled="busy" @click="logout">登出</button></div>
      <div v-if="!isAdmin" class="admin-panel"><h2>此帳號沒有管理員權限</h2><p>請由專案擁有者設定 word_admin 權限，完成後登出再登入。</p></div>
      <template v-else>
        <form class="admin-panel word-form" @submit.prevent="save">
          <h2>{{ editingId === null ? '新增單字' : '編輯單字' }}</h2>
          <fieldset :disabled="busy">
            <label>英文單字<input id="word-input" v-model="form.word" maxlength="100" required></label>
            <label>IPA 音標（不含外側斜線）<input v-model="form.ipa" maxlength="200" required></label>
            <label>中文意思<input v-model="form.meaning" maxlength="1000" required></label>
            <label>分類<input v-model="form.category" list="word-categories" maxlength="100" required><datalist id="word-categories"><option v-for="category in categories" :key="category" :value="category" /></datalist></label>
          </fieldset>
          <div class="admin-actions"><button class="admin-primary" :disabled="busy">{{ busy ? '處理中…' : '儲存單字' }}</button><button v-if="editingId !== null" type="button" :disabled="busy" @click="resetForm">取消編輯</button></div>
        </form>
        <div class="admin-panel">
          <div class="admin-list-heading"><h2>單字列表（{{ words.length }}）</h2><button :disabled="loading || busy" @click="refresh">重新載入</button></div>
          <label class="admin-search">搜尋單字<input v-model="search" type="search" placeholder="英文、中文或分類"></label>
          <p v-if="loading" role="status">載入中…</p>
          <p v-else-if="!filtered.length">沒有符合的單字。</p>
          <div v-else class="admin-table-wrap"><table><thead><tr><th>單字／音標</th><th>中文意思</th><th>分類</th><th>操作</th></tr></thead><tbody><tr v-for="word in filtered" :key="word.id"><td><strong>{{ word.word }}</strong><small>/{{ word.ipa }}/</small></td><td>{{ word.meaning }}</td><td>{{ word.category }}</td><td><div class="admin-actions"><button :disabled="busy" :aria-label="`編輯 ${word.word}`" @click="edit(word)">編輯</button><button class="admin-danger" :disabled="busy" :aria-label="`刪除 ${word.word}`" @click="remove(word)">刪除</button></div></td></tr></tbody></table></div>
        </div>
      </template>
    </template>
  </section>
</template>
