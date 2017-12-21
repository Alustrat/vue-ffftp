<template lang="pug">
  el-dialog(
    title="Tips",
    :visible.sync="isPassPopupVisible",
    fullscreen=true)
    .container.container-pop-up
      el-form(ref="passForm")
        el-row(':gutter'="20")
          el-col(':span'="24")
            el-form-item(prop="passPhrase")
              el-input(type="password", v-model="passphrase", placeholder="Enter your passphrase")
        el-row.row-form-buttons
          el-col.col-right(':span'="24")
            el-button(type="danger", @click="$parent.isPassPopupVisible = false") cancel
            el-button(type="success", '@click'="connect(item, passphrase)") connect
</template>

<script>
export default {
  data () {
    return {
      passphrase: ''
    }
  },
  props: ['isPassPopupVisible', 'connect', 'item']
}
</script>
