<template lang="pug">
  el-dialog(:visible.sync="mkdirPopupVisible", fullscreen=true)
    .container.container-pop-up
      el-form(:model="newFolder", :rules="newFolderRules", ref="newFolderForm")
        el-row(':gutter'="20")
          el-col(':span'="24")
            el-form-item(prop="name")
              el-input(type="text", v-model="newFolder.name", placeholder="folder name")
        el-row.row-form-buttons
          el-col.col-right(':span'="24")
            el-button(type="danger", @click="$parent.mkdirPopupVisible = false") cancel
            el-button(type="success", '@click'="validateForm('newFolderForm')") create
</template>

<script>
export default {
  data () {
    return {
      newFolder: {
        name: ''
      },
      newFolderRules: {
        name: [
          {required: true, trigger: 'blur'}
        ]
      }
    }
  },
  props: ['createFolder', 'mkdirPopupVisible'],
  methods: {
    validateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) { return false }
        let name = JSON.parse(JSON.stringify(this.newFolder.name))
        this.$parent.mkdirPopupVisible = false
        this.$parent.createFolder(name)
      })
    }
  }
}
</script>
