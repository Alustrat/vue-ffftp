<template lang="pug">
  .favorites(v-if="favs.length")
    .favorites-header favorites :
    el-row.list-favorites(':gutter'="15")
      el-col.col-center(':span'="4", v-for="fav in favs" ':key'="fav.name")
        el-button(type="primary" '@click'="connect(fav)") {{ fav.name }}
        .label.label-click('@click'="removeFromFavorites(fav)") delete
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      host: '',
      username: '',
      password: '',
      port: ''
    }
  },
  computed: {
    ...mapGetters({
      favs: 'getFavs'
    })
  },
  methods: {
    removeFromFavorites (item) {
      this.$store.commit('REMOVE_FROM_FAVORITE', item)
    },
    connect (item) {
      this.$server.connect(this.newConnexion).then(() => {
        this.newPath()
        this.$router.push({name: 'dashboard'})
      })
    },
    ...mapActions(['newPath'])
  }
}
</script>
