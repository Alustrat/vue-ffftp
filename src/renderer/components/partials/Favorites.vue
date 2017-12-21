<template lang="pug">
  .favorites(v-if="favs.length")
    .favorites-header Favorites :
    el-row.list-favorites(':gutter'="15")
      el-col.col-center(':span'="4", v-for="fav in favs", ':key'="fav.name")
        el-button(type="primary", '@click'="connect(fav)", v-bind:class="{ favSftp: fav.sftp }") {{ fav.name }}
        .label.label-click('@click'="removeFromFavorites(fav)") delete
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      host: '',
      username: '',
      password: '',
      port: ''
    }
  },
  props: ['connect'],
  computed: {
    ...mapGetters({
      favs: 'getFavs'
    })
  },
  methods: {
    removeFromFavorites (item) {
      this.$store.commit('REMOVE_FROM_FAVORITE', item)
    }
  }
}
</script>
