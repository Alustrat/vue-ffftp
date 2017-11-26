<template lang="pug">
  .dashboard
    vc-header(:pathString="pathString", :multipleSelection="multipleSelection", :loadItems="loadItems")
    .container.container-page
      el-table.list-items(ref="multipleTable", :data="items",
          @selection-change="handleSelectionChange",
          row-class-name="row-item",
          @row-click="handle",
          @row-dblclick="goToPath",
          v-on-click-outside="removeSelection",
          empty-text=" ",
          v-loading="loading")
        el-table-column(label="Name", class-name="name", width="60%", min-width="60%")
          template(scope="scope")
            i.ion-android-folder-open(v-if="scope.row.type == 'd'")
            i.ion-document(v-if="scope.row.type == '-'")
            | {{ scope.row.name }}
        el-table-column(label="Size", class-name="size", width="20%", min-width="20%")
          template(scope="scope") {{ scope.row.size | size }}
        el-table-column(label="Date", class-name="time", width="20%", min-width="20%")
          template(scope="scope") {{ scope.row.time | moment("MMM D, YYYY") }}
      .empty(v-if="!items.length")
        p Nothing found there ! :'(
      div.close('@click'="backToForm()") Retour
</template>

<script>
import ListHeader from '@/components/partials/ListHeader'
import { mapGetters, mapActions } from 'vuex'
import { ftpLs, ftpDestroy } from '@/utils/ftp'
import { rewritePath } from '@/utils/regex'

export default {
  data () {
    return {
      multipleSelection: [],
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      path: 'getCurrentPath',
      pathString: 'getCurrentPathString',
      items: 'getCurrentItems'
    })
  },
  components: {
    'vc-header': ListHeader
  },
  filters: {
    size (bytes) {
      if (bytes === 0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-'

      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      let number = Math.floor(Math.log(bytes) / Math.log(1024))

      return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + ' ' + units[number]
    }
  },
  onRowClick: function () {
    console.log('row clicked')
  },
  mounted: function () {
    this.loadItems()
  },
  methods: {
    handle (row, e) {
      let elem = e.path[2]
      if (e.ctrlKey) this.toggleSelection(row, elem)
      else this.uniqueSelection(row, elem)
    },
    uniqueSelection (row, elem) {
      this.removeSelection()
      this.$refs.multipleTable.toggleRowSelection(row)
      elem.classList.add('selected')
    },
    toggleSelection (row, elem) {
      this.$refs.multipleTable.toggleRowSelection(row)
      elem.classList.toggle('selected')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    removeSelection () {
      this.$refs.multipleTable.clearSelection()
      let elems = document.querySelectorAll('.selected')
      for (let i = 0; i < elems.length; i++) {
        elems[i].classList.remove('selected')
      }
    },
    loadItems () {
      let path = this.pathString
      let lsPath = rewritePath(path)
      this.loading = true
      console.log('pathstring : ', lsPath)
      ftpLs(lsPath).then(response => {
        console.log('items :', response)
        this.fillCurrentItems(response).then(response => {
          this.removeSelection()
          this.loading = false
        }, (err) => {
          console.log('error removing selection', err)
        })
      }, (err) => {
        console.log('ls err 2', err)
      })
    },
    goToPath (item) {
      if (item.type === 'd') this.goInto(item.name)
      this.loadItems()
    },
    backToForm () {
      ftpDestroy()
      this.$router.push({name: 'connexion-form'})
    },
    ...mapActions(['fillCurrentItems', 'goInto'])
  }
}
</script>
