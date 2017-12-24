<template lang="pug">
  header#list-header
    .container.container-full.container-center
      el-row.dir
        span(v-for="(folder, index) in path")
          a(@click="goBack(index)" v-if="folder == '.'") root
          a(@click="goBack(index)" v-if="!$last(index, path) && folder != '.'") {{ folder}}
          i.ion-chevron-right(v-if="!$last(index, path)")
          a(v-if="$last(index, path) && folder != '.'") {{folder }}
      el-row.workspace-buttons
        button(v-bind:disabled="path.length <= 1" '@click'="goFolderUp()")
          i.ion-android-arrow-dropup-circle
          | up
        button(@click.stop="mkdirPopupVisible = true")
          i.ion-android-folder-open
          | new folder
        button(v-bind:disabled="multipleSelection.length == 0" @click.stop="deleteFolder()")
          i.ion-trash-a
          | delete
        button(v-bind:disabled="multipleSelection.length == 0", @click.stop="triggerInput()")
          i.ion-android-download
          | download
        button(v-bind:disabled="multipleSelection.length != 1", @click.stop="renamePopupVisible = true")
          i.ion-edit
          | rename
        input(type="file", ref="inputDownload", @click.stop="", @change.stop="saveDownloadPath($event)" webkitdirectory)
    
    div.close('@click'="backToForm()")
      .ion-log-out
    
    vc-mkdir-popup(:createFolder="createFolder", :mkdirPopupVisible="mkdirPopupVisible")
    vc-rename-popup(:renameFolder="renameFolder", :renamePopupVisible="renamePopupVisible", :selectedFolderName="selectedFolderName")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MkdirPopup from '@/components/partials/MkdirPopup'
import RenamePopup from '@/components/partials/RenamePopup'

export default {
  data () {
    return {
      mkdirPopupVisible: false,
      renamePopupVisible: false,
      downloadPath: ''
    }
  },
  props: ['pathString', 'multipleSelection', 'loadItems'],
  computed: {
    selectedFolderName () {
      if (this.$parent.multipleSelection.length === 1) return this.$parent.multipleSelection[0].name
      return ''
    },
    ...mapGetters({
      path: 'getCurrentPath'
    })
  },
  components: {
    'vc-mkdir-popup': MkdirPopup,
    'vc-rename-popup': RenamePopup
  },
  methods: {
    goBack (index) {
      this.goBackTo(index)
      this.loadItems()
    },
    goFolderUp () {
      this.goUp()
      this.loadItems()
    },
    renameFolder (newName) {
      let oldPath = this.$parent.pathString + '/' + this.$parent.multipleSelection[0].name
      let newPath = this.$parent.pathString + '/' + newName
      this.$server.connexion.rename(oldPath, newPath)
        .then(() => {
          this.$message({ message: 'Success renaming file.', type: 'success' })
          this.loadItems()
        })
        .catch(() => this.$message.error('Error renaming file.'))
    },
    createFolder (newName) {
      let path = this.$parent.pathString + '/' + newName
      this.$server.connexion.mkdir(path)
        .then(() => {
          this.$message({ message: 'Success creating folder.', type: 'success' })
          this.loadItems()
        })
        .catch(() => this.$message.error('Error creating folder.'))
    },
    deleteFolder () {
      this.$server.deleteItems(this.$parent.pathString, this.$parent.multipleSelection)
        .then(() => {
          this.$message({ message: 'Success deleting file.', type: 'success' })
          this.loadItems()
        })
        .catch(() => this.$message.error('Error deleting file.'))
    },
    triggerInput () {
      this.$refs.inputDownload.click()
    },
    saveDownloadPath (e) {
      e.stopPropagation()
      let downloadPath = e.target.files[0].path
      this.$server.downloadItems(this.$parent.multipleSelection, this.$parent.pathString, downloadPath)
        .then(() => {
          this.$message({ message: 'Success downloading files.', type: 'success' })
          e.target.value = ''
          this.loadItems()
        })
        .catch(() => this.$message.error('Error downloading files.'))
    },
    backToForm () {
      this.$server.connexion.disconnect()
      this.clearLogs()
      this.$router.push({name: 'connexion-form'})
    },
    ...mapActions(['goUp', 'goBackTo', 'clearLogs'])
  }
}
</script>
