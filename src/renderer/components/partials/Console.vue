<template lang="pug">
  .console(v-bind:class="{ open: isOpen }", v-on:click="toggleConsole")
    .console-header
      i.ion-ios-arrow-up
      p(:class="logClass(lastLog.type)") {{ lastLog.message }}
      .counter {{ count }}
    .console-main
      .console-body
        i.ion-ios-arrow-down
        p(v-for="log in logs", :class="logClass(log.type)") {{ log.message }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapGetters({
      logs: 'getLogs',
      count: 'countLogs',
      lastLog: 'getLastLog'
    })
  },
  methods: {
    logClass (type) {
      return 'type-' + type
    },
    toggleConsole () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>
