<template>
<div :class="[$style.container]">
  <iframe :src="src" frameborder="0" v-if="src" :class="[$style.content]"></iframe>
  <div :class="[$style.loading]" v-if="loading">
    <p class="ft-32"><v-icon type="loading-3-quarters" spin></v-icon></p>
    <p>文件转换中...</p>
  </div>
  <div :class="[$style.close]" @click="onClose"><v-icon type="close-circle-o"></v-icon></div>
</div>
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
  src: string = ''

  loading: boolean = false

  onClose () {
    this.close()
  }

  mounted () {
    this.loading = true
    let request
    if (this.library) {
      request = previewFileForLibrary(this.row.libraryId)
    } else if (this.linkId) request = previewFileForShare(this.linkId, this.password, this.row.id)
    else request = previewFile(this.row.id)
    request.then(data => {
      this.src = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
      // const win = window.open() as any
      // const html = `'<iframe name="${name}" src="${url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      // win.document.write(html)
      // win.document.title = name
      // window.URL.revokeObjectURL(url) // 释放掉blob对象
    })
      .catch((e) => {
        this.close()
      })
      .finally(() => {
        this.loading = false
      })
  }

  beforeDestroy () {
    if (this.src) window.URL.revokeObjectURL(this.src) // 释放掉blob对象
  }
}
</script>

<style lang="scss" module>
.container {
  position: fixed;
  z-index: 3000;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, .35);
}

.content {
  border: 0;
  width: 100%;
  height: 100%;
}

.close {
  position: absolute;
  right: .5rem;
  top: .5rem;
  font-size: 2rem;
  cursor: pointer;
}

.loading {
  background: transparent;
  color: #fff;
  position: absolute;
  text-align: center;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>
