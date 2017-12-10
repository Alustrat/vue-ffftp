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
    
    vc-mkdir-popup(:createFolder="createFolder", :mkdirPopupVisible="mkdirPopupVisible")
    vc-rename-popup(:renameFolder="renameFolder", :renamePopupVisible="renamePopupVisible", :selectedFolderName="selectedFolderName")
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ftpMkdir, ftpRename } from '@/utils/ftp'
import { deleteItems, downloadItems } from '@/utils/downloads'
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
      ftpRename(oldPath, newPath).then(response => {
        this.loadItems()
      })
    },
    createFolder (newName) {
      let path = this.$parent.pathString + '/' + newName
      ftpMkdir(path).then(response => {
        this.loadItems()
      })
    },
    deleteFolder () {
      deleteItems(this.$parent.pathString, this.$parent.multipleSelection).then(() => {
        this.loadItems()
      })
    },
    triggerInput () {
      this.$refs.inputDownload.click()
    },
    saveDownloadPath (e) {
      e.stopPropagation()
      let downloadPath = e.target.files[0].path
      downloadItems(downloadPath, this.$parent.pathString, this.$parent.multipleSelection).then(() => {
        e.target.value = ''
        this.loadItems()
      })
    },
    ...mapActions(['goUp', 'goBackTo'])
  }
}
</script>
