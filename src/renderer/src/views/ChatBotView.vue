<script setup>
import BotItem from '@components/bot/BotItem.vue'
import { onMounted, ref } from 'vue'
import config from '@/config'

const props = defineProps({ username: String })

const bot = ref()
const input = ref()
const messages = ref([])

const scrollAreaRef = ref(null)

async function getBot() {
  const response = await api.bot.getBot(props.username)
  bot.value = response.data
}

function sendMessage() {
  if (!input.value)
    return

  api.bot.sendChatBot(props.username, input.value)
  onReset()
}

function onReset() {
  input.value = ''
}

function scrollToBottom() {
  const scrollTarget = scrollAreaRef.value?.getScrollTarget()
  scrollAreaRef.value?.setScrollPosition(
    'vertical',
    scrollTarget.scrollHeight,
    50,
  )
}

api.bot.onMessageBotReceived(props.username, (message) => {
  messages.value.push(message)
  scrollToBottom()
})

onMounted(getBot)
</script>

<template>
  <q-page v-if="bot?.username" class="window-height column q-pa-sm">
    <!-- Header -->
    <q-list bordered class="rounded-borders q-my-sm">
      <BotItem v-model="bot" />
    </q-list>

    <!-- Chat Messages -->
    <q-scroll-area ref="scrollAreaRef" class="col-grow q-border q-my-sm">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="q-my-xs q-mr-xs"
      >
        {{ message }}
      </div>
    </q-scroll-area>

    <!-- Input -->
    <div class="row items-center q-pa-sm">
      <q-input
        v-model="input"
        autofocus
        dense
        outlined
        class="col-grow"
        placeholder="Type a message..."
        :disable="bot.status !== config.BOT_STATUS.CONNECTED "
        @keyup.enter="sendMessage"
      />
      <q-btn
        round
        dense
        flat
        icon="send"
        class="q-ml-sm"
        :disable="bot.status !== config.BOT_STATUS.CONNECTED "
        @click="sendMessage"
      />
    </div>
  </q-page>
</template>
