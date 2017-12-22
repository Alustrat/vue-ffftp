<template lang="pug">
  header#main-header
    el-row
      el-col.col-center(':span'="24")
        a(href="http://ffftp.site", target="_blank")
          img#header-logo(v-bind:src="logoUrl")
</template>

<script>
export default {
  data () {
    return { logoUrl: 'static/img/logo.png' }
  }
}
</script>
