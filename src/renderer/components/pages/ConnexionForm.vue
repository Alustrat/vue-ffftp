<template lang="pug">
  .Home
    <vc-header></vc-header>
    .container.container-form.container-center
      el-form(:model="newConnexion", :rules="connexionRules", ref="connexionForm")
        el-row(':gutter'="20")
          el-col(':span'="6")
            el-form-item(prop="serverConfig.host")
              el-input(type="text", v-model="newConnexion.serverConfig.host", placeholder="yourwebsite.com")
              .label.label-required host / server
          el-col(':span'="6")
            el-form-item(prop="serverConfig.user")
              el-input(type="text", v-model="newConnexion.serverConfig.user", placeholder="johndoe")
              .label username
          el-col(':span'="6")
            el-form-item(prop="serverConfig.password")
              el-input(type="password", v-model="newConnexion.serverConfig.password", placeholder="••••••••")
              .label password
          el-col(':span'="6")
            el-form-item(prop="serverConfig.port")
              el-input(type="number", v-model.number="newConnexion.serverConfig.port", placeholder="21")
              .label port
        el-row.row-form-buttons
          el-col.col-right(':span'="24")
            el-button(':plain'="true", type="info", @click="loadPopUp('connexionForm')") save to favorites
            el-button(type="success", '@click'="connect('connexionForm1')", ':disabled'="validated") connect
        
      vc-favorites
    
    vc-fav-popup(:new-connexion="newConnexion", :dialog-visible="dialogVisible")

</template>

<script>
import Header from '@/components/partials/Header'
import Favorites from '@/components/partials/Favorites'
import FavPopUp from '@/components/partials/FavPopUp'
import { mapActions } from 'vuex'
import { ftpNewConnexion } from '@/utils/ftp'

export default {
  data () {
    return {
      validated: false,
      dialogVisible: false,
      newConnexion: {
        name: '',
        connexionType: 'ftp',
        serverConfig: {
          host: '',
          user: '',
          password: '',
          port: 21
        }
      },
      connexionRules: {
        'serverConfig.host': [
          {required: true, trigger: 'blur'}
        ]
      }
    }
  },
  components: {
    'vc-header': Header,
    'vc-favorites': Favorites,
    'vc-fav-popup': FavPopUp
  },
  methods: {
    loadPopUp (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) { return false }
        this.dialogVisible = true
      })
    },
    connect (formName) {
      this.validated = false
      ftpNewConnexion(this.newConnexion.serverConfig).then(response => {
        this.validated = false
        this.newPath()
        this.$router.push({name: 'dashboard'})
      }, (err) => {
        console.log('err connexion', err)
        this.validated = false
        // on affiche un message d'erreur
      })
    },
    ...mapActions(['newPath'])
  }
}
</script>
