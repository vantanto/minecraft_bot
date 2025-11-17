<script setup>
import { onMounted, ref } from 'vue'

const server = ref({})

const getServer = async () => {
  const response = await api.storage.getServer()
  server.value = response.data
}

onMounted(() => {
  getServer()
})
</script>

<template>
  <q-card dark>
    <q-card-section class="text-center">
      <p class="q-mb-xs">
        <strong>Server Host: </strong> {{ server.host }}:{{ server.port }}
      </p>
      <p class="q-mb-xs">
        <strong>Minecraft Version: </strong> {{ server.version }}
      </p>
    </q-card-section>
  </q-card>
</template>
