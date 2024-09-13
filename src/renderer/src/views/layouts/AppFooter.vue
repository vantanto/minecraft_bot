<script setup>
import { onMounted, ref } from 'vue'

const appVersion = ref('')

onMounted(async () => {
  appVersion.value = await window.api.getVersion()
})
</script>

<template>
  <q-footer class="bg-grey-4 text-black q-py-xs q-px-md">
    <div class="flex items-center justify-between">
      <small class="text-caption"> &#169; 2024 VanTanto</small>
      <small class="text-caption">v{{ appVersion }}</small>
    </div>
  </q-footer>
</template>
