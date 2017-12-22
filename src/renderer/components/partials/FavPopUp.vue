<template lang="pug">
  el-dialog(
    title="Tips",
    :visible.sync="dialogVisible",
    fullscreen=true)
    .container.container-pop-up
      el-form(:model="newConnexion", :rules="nameRules", ref="nameForm")
        el-row(':gutter'="20")
          el-col(':span'="24")
            el-form-item(prop="name")
              el-input(type="text", v-model="newConnexion.name", placeholder="yourname")
        el-row.row-form-buttons
          el-col.col-right(':span'="24")
            el-button(type="danger", @click="$parent.dialogVisible = false") cancel
            el-button(type="success", '@click'="addToFavorites('nameForm')") save
</template>

<script>
import {mapActions} from 'vuex'

export default {
  data () {
    return {
      nameRules: {
        name: [
          {required: true, trigger: 'blur'}
        ]
      }
    }
  },
  props: ['newConnexion', 'dialogVisible'],
  methods: {
    addToFavorites (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) { return false }
        let item = JSON.parse(JSON.stringify(this.newConnexion))
        this.addFavs(item)
        this.$parent.dialogVisible = false
        this.$parent.newConnexion.name = ''
      })
    },
    ...mapActions(['addFavs'])
  }
}
</script>
