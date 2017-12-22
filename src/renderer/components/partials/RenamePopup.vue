<template lang="pug">
  el-dialog(title="Tips", :visible.sync="renamePopupVisible", fullscreen=true)
    .popup(@click.stop="")
      .container.container-pop-up
        el-form(:model="folder", :rules="renameFolderRules", ref="renameFolderForm")
          el-row(':gutter'="20")
            el-col(':span'="24")
              el-form-item(prop="name")
                el-input(type="text", v-model="folder.name", placeholder="Directory or File.ext")
          el-row.row-form-buttons
            el-col.col-right(':span'="24")
              el-button(type="danger", @click="$parent.renamePopupVisible = false") cancel
              el-button(type="success", '@click'="validateForm('renameFolderForm')") rename
</template>

<script>
export default {
  data () {
    return {
      folder: {
        name: ''
      },
      renameFolderRules: {
        name: [
          {required: true, trigger: 'blur'}
        ]
      }
    }
  },
  props: ['renameFolder', 'renamePopupVisible', 'selectedFolderName'],
  watch: {
    renamePopupVisible (newState) {
      if (newState) this.folder.name = this.selectedFolderName
    }
  },
  methods: {
    validateForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) { return false }
        let name = JSON.parse(JSON.stringify(this.folder.name))
        this.$parent.renamePopupVisible = false
        this.$parent.renameFolder(name)
      })
    }
  }
}
</script>
