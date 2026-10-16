<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
<header class="topbar">
      <RouterLink class="brand" to="/" aria-label="Word Garden 首頁"><span class="brand-icon">w<span>·</span></span>Word Garden</RouterLink>
      <RouterLink class="admin-nav" to="/admin/words">單字管理</RouterLink>
      <span class="top-label">每天一點，英文更近一點 <span class="tiny-flower">✳</span></span>
    </header>
</template>
