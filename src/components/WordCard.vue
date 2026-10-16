<script setup>
defineProps({
  item: { type: Object, required: true },
  playing: { type: Boolean, default: false },
})
defineEmits(['speak'])
</script>

<template>
<article class="word-card" :class="{ playing: playing }">
            <div class="card-top"><span class="category-badge" :data-category="item.category">{{ item.category }}</span><span class="word-number">{{ String(item.id).padStart(3, '0') }}</span></div>
            <h3 lang="en">{{ item.word }}</h3>
            <div class="ipa" lang="en-US">/{{ item.ipa }}/</div>
            <div class="card-bottom"><span class="meaning">{{ item.meaning }}</span><button class="speak-button" :class="{ 'is-speaking': playing }" :aria-label="`播放 ${item.word} 的發音`" :aria-pressed="playing" @click="$emit('speak', item.word)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 5 9H2v6h3l6 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg></button></div>
          </article>
</template>
