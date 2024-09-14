<script setup>
import { onMounted, ref } from 'vue'
import BotCreateDialog from '@renderer/components/bot/BotCreateDialog.vue'
import BotItem from '@renderer/components/bot/BotItem.vue'

const bots = ref([])
const createDialog = ref(false)

const getBots = async () => {
  const response = await api.bot.getBots()
  bots.value = response.data
}

const handleCreate = () => {
  createDialog.value = true
}

onMounted(() => {
  getBots()
})
</script>

<template>
  <q-page class="q-pa-md">
    <q-btn push label="New Bot" color="primary" @click="handleCreate" />

    <q-list bordered class="rounded-borders q-my-md">
      <bot-item v-for="(bot, index) in bots" :key="index" :data="bot" :index="index" />
    </q-list>

    <bot-create-dialog v-model="createDialog" @update:save="getBots" />
  </q-page>
</template>
