<script setup>
import BotStatus from '@renderer/components/bot/BotStatus.vue'
import { useQuasar } from 'quasar'
import { ref, watchEffect } from 'vue'
import config from '@/config'

const props = defineProps({
  data: Object,
})

const emit = defineEmits(['update:save'])

const $q = useQuasar()

const botData = ref({})
const loading = ref({})

// async function getBot() {
//   const response = await api.bot.getBot(props.data.username)
//   botData.value = response.data
// }

async function connectBot() {
  loading.value.connect = true
  const response = await api.bot.connectBot(props.data.username)
  loading.value.connect = false
  if (response.status === config.RESPONSE_STATUS.ERROR)
    $q.notify(response.message)
}

async function disconnectBot() {
  loading.value.connect = true
  await api.bot.disconnectBot(props.data.username)
  loading.value.connect = false
}

function openChatBot() {
  api.bot.openChatBot(props.data.username)
}

async function deleteBot() {
  loading.value.delete = true
  const response = await api.bot.deleteBot(props.data.username)
  loading.value.delete = false
  emit('update:save')
  $q.notify(response.message)
}

api.bot.onStatusBotUpdated(props.data.username, (status) => {
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
        <img :src="config.getMcAvatar(botData.username)">
      </q-avatar>
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ botData.username }}</q-item-label>
      <BotStatus :status="botData.status" />
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
        <q-btn
          dense
          flat
          :color="
            botData.status === config.BOT_STATUS.CONNECTED ? 'primary' : ''
          "
          icon="chat_bubble"
          :disable="botData.status !== config.BOT_STATUS.CONNECTED"
          @click="openChatBot"
        >
          <q-tooltip>Chat</q-tooltip>
        </q-btn>

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
