<script setup>
import { ref } from 'vue'

const props = defineProps({ username: String })

const input = ref()
const messages = ref([])

const scrollAreaRef = ref(null)

function sendMessage() {
  if (!input.value) return

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
</script>

<template>
  <q-page class="window-height column q-pa-sm">
    <!-- Header -->
    <q-toolbar class="bg-primary text-white rounded-borders">
      <q-toolbar-title>{{ username }}</q-toolbar-title>
    </q-toolbar>

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
        @keyup.enter="sendMessage"
      />
      <q-btn
        round
        dense
        flat
        icon="send"
        class="q-ml-sm"
        @click="sendMessage"
      />
    </div>
  </q-page>
</template>
