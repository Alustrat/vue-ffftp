<template lang="pug">
  .Home
    vc-header
    .container.container-form.container-center
      el-form(:model="newConnexion", :rules="connexionRules", ref="connexionForm")
        el-row(':gutter'="20", class="switch-row")
          el-col(':span'="20")
            el-switch(v-model="newConnexion.sftp", class="switch-sftp"
              active-text="SFTP",
              inactive-text="FTP",
              active-color="#ffd818",
              inactive-color="#409eff")
            el-checkbox(v-if="newConnexion.sftp", v-model="sshKey", class="checkbox-key") Use ssh key
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
            el-form-item(v-if="!sshKey || !newConnexion.sftp", prop="serverConfig.password")
              el-input(type="password", v-model="newConnexion.serverConfig.password", placeholder="••••••••")
              .label password
            el-form-item(v-if="sshKey && newConnexion.sftp", prop="serverConfig.keyPath")
              el-input(type="text", v-model="newConnexion.serverConfig.keyPath", placeholder="~/.ssh/id_rsa")
              .label key path
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

export default {
  data () {
    return {
      validated: false,
      dialogVisible: false,
      sshKey: false,
      newConnexion: {
        name: '',
        sftp: false,
        serverConfig: {
          host: '',
          user: '',
          password: '',
          keyPath: '',
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
      this.$server.connect(this.newConnexion).then(() => {
        this.$router.push({name: 'dashboard'})
      })
    }
  }
}
</script>
