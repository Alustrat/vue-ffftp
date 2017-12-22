<template>
  <div id="app" v-bind:class="{ active: isDragged }" @dragstart="isDragged = true" @dragleave="isDragged = false" @drop="uploadFiles($event)">
    <router-view></router-view>
    <vc-draghover></vc-draghover>
  </div>
</template>

<script>
import DragHover from '@/components/partials/DragHover'
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isDragged: false
    }
  },
  components: {
    'vc-draghover': DragHover
  },
  computed: {
    ...mapGetters({
      pathString: 'getCurrentPathString'
    })
  },
  mounted: function () {
    this.loadFavs()
  },
  methods: {
    uploadFiles (e) {
      let dt = e.dataTransfer
      let items = []

      if (dt.items) {
        for (var i = 0; i < dt.items.length; i++) {
          if (dt.items[i].kind === 'file') {
            var f = dt.items[i].getAsFile()
            items.push(f)
          }
        }
        this.$server.uploadItems(items, this.pathString)
          .then(() => this.$emit('reload'))
      }
    },
    ...mapActions(['loadCurrentPath', 'loadFavs'])
  },
  name: 'vue-ffftp'
}
</script>

<style lang="sass">
  @import './assets/styles/app.scss'
</style>
