<script setup>
import { onMounted, ref } from 'vue'
import BotCreateDialog from '@renderer/components/bot/BotCreateDialog.vue'
import BotItem from '@renderer/components/bot/BotItem.vue'
import ServerInfo from '@renderer/components/ServerInfo.vue'

const bots = ref([])
const createDialog = ref(false)

const getBots = async () => {
  const response = await api.bot.getBots()
  bots.value = response.data
}

const handleCreate = () => {
  createDialog.value = true
}

onMounted(async () => {
  getBots()
})
</script>

<template>
  <q-page class="q-pa-md">
    <ServerInfo class="q-mb-md" />
    <div class="flex justify-center">
      <q-btn push no-caps label="Add New Bot" color="positive" @click="handleCreate" />
    </div>

    <q-list class="rounded-borders q-my-md">
      <bot-item
        v-for="(bot, index) in bots"
        :key="index"
        :data="bot"
        :index="index"
        @update:save="getBots"
      />
    </q-list>

    <bot-create-dialog v-model="createDialog" @update:save="getBots" />
  </q-page>
</template>
