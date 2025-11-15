<script setup>
import { ref, watchEffect } from 'vue'
import { useQuasar } from 'quasar'
import config from '@/config'
import BotStatus from '@renderer/components/bot/BotStatus.vue'

const $q = useQuasar()

const emit = defineEmits(['update:save'])
const props = defineProps({
  data: Object,
  index: Number
})

const botData = ref({})
const loading = ref({})

const getBot = async () => {
  const response = await api.bot.getBot(props.index)
  botData.value = response.data
}

const connectBot = async () => {
  loading.value.connect = true
  const response = await api.bot.connectBot(props.index)
  loading.value.connect = false
  if (response.status === config.RESPONSE_STATUS.ERROR) $q.notify(response.message)
}

const disconnectBot = async () => {
  loading.value.connect = true
  await api.bot.disconnectBot(props.index)
  loading.value.connect = false
}

const deleteBot = async () => {
  loading.value.delete = true
  const response = await api.bot.deleteBot(props.index)
  loading.value.delete = false
  emit('update:save')
  $q.notify(response.message)
}

api.bot.onStatusBotUpdated((username, status) => {
  if (botData.value.username == username) {
    botData.value.status = status
  }
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
        <!-- CONNECT -->
        <q-btn
          v-if="botData.status !== config.BOT_STATUS.CONNECTED"
          dense
          flat
          color="positive"
          icon="play_arrow"
          :loading="loading.connect"
          @click="connectBot"
        >
          <q-tooltip>Connect</q-tooltip>
        </q-btn>

        <!-- DISCONNECT -->
        <q-btn
          v-else
          dense
          flat
          color="negative"
          icon="stop"
          :loading="loading.connect"
          @click="disconnectBot"
        >
          <q-tooltip>Disconnect</q-tooltip>
        </q-btn>

        <!-- CHAT -->
        <!-- <q-btn dense flat color="primary" icon="chat_bubble" @click="openChatPopup">
          <q-tooltip>Chat</q-tooltip>
        </q-btn> -->

        <!-- DELETE -->
        <q-btn
          dense
          flat
          color="negative"
          icon="delete"
          :loading="loading.delete"
          @click="deleteBot"
        >
          <q-tooltip>Delete</q-tooltip>
        </q-btn>
      </div>
    </q-item-section>
  </q-item>
</template>
