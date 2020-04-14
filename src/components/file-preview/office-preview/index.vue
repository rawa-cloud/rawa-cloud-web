<template>
<div></div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import BasePreview from '../BasePreview'
import { previewFile } from '@/api/file'
import { preview as previewFileForShare } from '@/api/share'
import { previewFileForLibrary } from '@/api/library'
import { preview } from '@/helpers/download'

@Component
export default class OfficePreview extends mixins(BasePreview) {
  officeBaseUrl = '/office/index.html?'

  get params () {
    const ret = {
      fileType: this.row.contentType,
      key: this.row.id,
      title: this.row.name,
      url: 'http://host.docker.internal:8080/nas/download/' + this.row.uuid,
      documentType: '',
      mode: 'view',
      hostname: location.hostname
    }
    return ret
  }

  get officeUrl () {
    const query = Object.entries(this.params).map(([k, v]) => `${k}=${v}`).join('&')
    return this.officeBaseUrl + query
  }

  mounted () {
    window.open(this.officeUrl, '_blank')
    this.close()
  }
}
</script>
