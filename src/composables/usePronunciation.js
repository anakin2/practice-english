import { ref, onBeforeUnmount } from 'vue'

export function usePronunciation() {
  const speaking = ref('')
  const message = ref('')
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window
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

  return { speaking, message, speak }
}
