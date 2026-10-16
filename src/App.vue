<script setup>
import { computed, ref, onBeforeUnmount } from 'vue'
import { words, categories } from './words'
const query = ref('')
const selected = ref('全部單字')
const speaking = ref('')
const message = ref('')
const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
const filtered = computed(() => words.filter(w => (selected.value === '全部單字' || w.category === selected.value) && `${w.word} ${w.meaning}`.toLowerCase().includes(query.value.trim().toLowerCase())))
function speak(word) {
  message.value = ''
  if (!supported) { message.value = '這個瀏覽器不支援語音播放，請使用新版 Chrome、Edge 或 Safari。'; return }
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = 'en-US'
  utterance.rate = 0.8
  const voices = window.speechSynthesis.getVoices()
  const voice = voices.find(v => v.lang === 'en-US') || voices.find(v => v.lang.startsWith('en'))
  if (voice) utterance.voice = voice
  speaking.value = word
  utterance.onend = () => { if (speaking.value === word) speaking.value = '' }
  utterance.onerror = (event) => {
    if (event.error !== 'interrupted' && event.error !== 'canceled') { speaking.value = ''; message.value = '發音暫時無法播放，請檢查裝置語音設定後再試一次。' }
  }
  window.speechSynthesis.speak(utterance)
}
onBeforeUnmount(() => { if (supported) window.speechSynthesis.cancel() })
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="./" aria-label="Word Garden 首頁"><span class="brand-icon">w<span>·</span></span>Word Garden</a>
      <span class="top-label">每天一點，英文更近一點 <span class="tiny-flower">✳</span></span>
    </header>
    <main>
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow"><span></span> YOUR DAILY DOSE OF ENGLISH</div>
          <h1>讓每個單字，<br>成為你的<span class="accent">小小進步。</span></h1>
          <p>從生活出發，累積英文的底氣。<br class="mobile-break">100 個國中必學單字，聽一聽、念一念，慢慢記住。</p>
          <div class="hero-tags"><span>✦ 國中程度</span><span>◉ 美式音標</span><span>♫ 點擊即發音</span></div>
        </div>
        <div class="hero-art" aria-hidden="true">
          <span class="art-spark spark-one">✳</span><span class="art-spark spark-two">✧</span>
          <div class="paper paper-back"></div>
          <div class="paper paper-front"><span class="paper-label">A LITTLE WORD, A BIG WORLD</span><div class="paper-word">hello<span>!</span></div><div class="paper-ipa">/həˈloʊ/</div><div class="paper-bottom"><span>你好，新的開始</span><span class="paper-speaker">♫</span></div></div>
          <div class="floating-note">a word a day 🌱</div>
        </div>
      </section>
      <section class="vocabulary" aria-label="單字練習">
        <div class="section-heading"><div><span class="section-eyebrow">THE COLLECTION</span><h2>我的單字花園 <span>100 WORDS</span></h2></div><label class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></svg><input v-model="query" type="search" placeholder="搜尋英文或中文…" aria-label="搜尋英文或中文"></label></div>
        <div class="filter-row" aria-label="單字分類"><button v-for="category in ['全部單字', ...categories.map(c => c.name)]" :key="category" :class="['filter', { active: selected === category }]" :aria-pressed="selected === category" @click="selected = category">{{ category }}<span>{{ category === '全部單字' ? 100 : 20 }}</span></button></div>
        <div class="results-line"><span>共 <strong>{{ filtered.length }}</strong> 個單字<span v-if="selected !== '全部單字'"> · {{ selected }}</span></span><span class="listen-hint">點擊 <span>♫</span> 聽聽正確發音</span></div>
        <p v-if="message" class="notice" role="alert">{{ message }}</p>
        <div v-if="filtered.length" class="card-grid">
          <article v-for="item in filtered" :key="item.id" class="word-card" :class="{ playing: speaking === item.word }">
            <div class="card-top"><span class="category-badge" :data-category="item.category">{{ item.category }}</span><span class="word-number">{{ String(item.id).padStart(3, '0') }}</span></div>
            <h3 lang="en">{{ item.word }}</h3>
            <div class="ipa" lang="en-US">/{{ item.ipa }}/</div>
            <div class="card-bottom"><span class="meaning">{{ item.meaning }}</span><button class="speak-button" :class="{ 'is-speaking': speaking === item.word }" :aria-label="`播放 ${item.word} 的發音`" :aria-pressed="speaking === item.word" @click="speak(item.word)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 5 9H2v6h3l6 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg></button></div>
          </article>
        </div>
        <div v-else class="empty"><span>⌕</span><h3>還找不到這個單字</h3><p>試試其他英文或中文，或切換分類。</p><button @click="query = ''; selected = '全部單字'">顯示全部單字</button></div>
        <div class="collection-end"><span>✳</span><p>每一次練習，都在悄悄成長。</p><small>Take your time. Make it yours.</small></div>
      </section>
    </main>
    <footer><span class="footer-brand">Word Garden<span> · 把英文種進生活裡</span></span><span>發音由瀏覽器語音提供 · 音色依裝置而異</span></footer>
    <span class="sr-only" role="status" aria-live="polite">{{ speaking ? `正在播放 ${speaking}` : '' }}</span>
  </div>
</template>
