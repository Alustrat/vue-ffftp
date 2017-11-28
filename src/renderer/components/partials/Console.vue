<template lang="pug">
  .console(v-bind:class="{ open: isOpen }", v-on:click="toggleConsole")
    i.ion-ios-arrow-up
    .console-body
      i.ion-ios-arrow-down
      p Ceci est un message test statique
      p(v-for="log in logs") {{ log.message }}
    .counter {{ count }}
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
      count: 'countLogs'
    })
  },
  methods: {
    toggleConsole () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>
