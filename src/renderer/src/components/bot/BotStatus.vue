<script setup>
import config from '@/config'

defineProps({
  status: String
})
</script>

<template>
  <q-item-label
    caption
    :class="status === config.BOT_STATUS.CONNECTED ? 'text-positive' : 'text-negative'"
  >
    <q-icon size="xs" name="circle" />
    {{ status }}
  </q-item-label>
</template>
