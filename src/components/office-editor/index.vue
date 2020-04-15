<template>
<div></div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

const appUrl = process.env.VUE_APP_OFFICE_APP_URL
const officePort = process.env.VUE_APP_OFFICE_HOST_PORT

@Component
export default class OfficeEditor extends Vue {
  @Prop() row!: any

  @Prop(Boolean) editable!: boolean

  officeBaseUrl = '/office/index.html?'

  get params () {
    const ret = {
      fileType: this.row.contentType,
      key: this.row.uuid,
      id: this.row.id,
      title: this.row.name,
      appUrl: appUrl,
      documentType: '',
      mode: this.editable ? 'edit' : 'view',
      hostname: location.hostname,
      userId: this.$auth.username,
      userName: this.$auth.principle && this.$auth.principle.cname,
      officePort: officePort
    }
    return ret
  }

  get officeUrl () {
    const query = Object.entries(this.params).map(([k, v]) => `${k}=${v}`).join('&')
    return this.officeBaseUrl + query
  }

  mounted () {
    window.open(this.officeUrl, '_blank')
  }
}
</script>
