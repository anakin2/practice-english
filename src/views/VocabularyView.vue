<script setup>
import { computed, ref } from 'vue'
import { words, categories } from '../words'
import WordCard from '../components/WordCard.vue'
import { usePronunciation } from '../composables/usePronunciation'

const query = ref('')
const selected = ref('全部單字')
const { speaking, message, speak } = usePronunciation()
const filtered = computed(() => words.filter(w =>
  (selected.value === '全部單字' || w.category === selected.value) &&
  `${w.word} ${w.meaning}`.toLowerCase().includes(query.value.trim().toLowerCase())
))
</script>

<template>
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
          <WordCard v-for="item in filtered" :key="item.id" :item="item" :playing="speaking === item.word" @speak="speak" />
        </div>
        <div v-else class="empty"><span>⌕</span><h3>還找不到這個單字</h3><p>試試其他英文或中文，或切換分類。</p><button @click="query = ''; selected = '全部單字'">顯示全部單字</button></div>
        <div class="collection-end"><span>✳</span><p>每一次練習，都在悄悄成長。</p><small>Take your time. Make it yours.</small></div>
      </section>
    <span class="sr-only" role="status" aria-live="polite">{{ speaking ? `正在播放 ${speaking}` : '' }}</span>
</template>
