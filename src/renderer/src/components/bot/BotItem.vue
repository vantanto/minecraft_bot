<script setup>
import { ref, watchEffect } from 'vue'
import { useQuasar } from 'quasar'
import config from '@/config'
import BotStatus from '@renderer/components/bot/BotStatus.vue'

const $q = useQuasar()

const props = defineProps({
  data: Object,
  index: Number
})

const botData = ref({})
const loadingConnect = ref(false)

const getBot = async () => {
  const response = await api.bot.getBot(props.index)
  botData.value = response.data
}

const connectBot = async () => {
  loadingConnect.value = true
  const response = await api.bot.connectBot(props.index)
  loadingConnect.value = false
  if (response.status === config.RESPONSE_STATUS.ERROR) $q.notify(response.message)
}

const disconnectBot = async () => {
  loadingConnect.value = true
  await api.bot.disconnectBot(props.index)
  loadingConnect.value = false
  if (response.status === config.RESPONSE_STATUS.ERROR) $q.notify(response.message)
}

api.bot.onStatusBotUpdated((status) => {
  botData.value.status = status
})

watchEffect(() => {
  botData.value = props.data
})
</script>

<template>
  <q-item v-if="botData.username">
    <q-item-section side>
      <q-avatar rounded size="48px">
        <img :src="config.getMcAvatar(botData.username)" />
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ botData.username }}</q-item-label>
      <bot-status :status="botData.status" />
    </q-item-section>
    <q-item-section top side>
      <div class="q-gutter-xs">
        <q-btn
          v-if="botData.status !== config.BOT_STATUS.CONNECTED"
          flat
          icon="play_circle"
          :loading="loadingConnect"
          @click="connectBot"
        >
          <q-tooltip> Connect </q-tooltip>
        </q-btn>
        <q-btn v-else flat icon="stop_circle" :loading="loadingConnect" @click="disconnectBot">
          <q-tooltip> Disconnect </q-tooltip>
        </q-btn>
        <!-- <q-btn flat icon="message" @click="openChatPopup">
          <q-tooltip> Chat </q-tooltip>
        </q-btn>
        <q-btn flat icon="delete" color="negative" @click="deleteBot">
          <q-tooltip> Delete </q-tooltip>
        </q-btn> -->
      </div>
    </q-item-section>
  </q-item>
</template>
