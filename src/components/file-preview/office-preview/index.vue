<template>
<office-editor :row="row"></office-editor>
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
  mounted () {
    this.close()
  }
}
</script>
