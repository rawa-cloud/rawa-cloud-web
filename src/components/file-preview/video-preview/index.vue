<template>
<div :class="[$style.container]">
  <iframe :src="`./video/index.html?src=${src}&type=${type}&password=${password}`" frameborder="0" :class="[$style.content]" v-if="src"></iframe>
  <div :class="[$style.loading]" v-if="loading">
    <p class="ft-32"><v-icon type="loading-3-quarters" spin></v-icon></p>
    <p>加载中...</p>
  </div>
  <div :class="[$style.close]" @click="onClose"><v-icon type="close-circle-o"></v-icon></div>
</div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import BasePreview from '../BasePreview'
import { preview } from '@/helpers/download'

@Component
export default class VideoPreview extends mixins(BasePreview) {
  src: string = ''

  loading: boolean = false

  onClose () {
    this.close()
  }

  mounted () {
    const baseUrl = process.env.VUE_APP_API_BASE_URL
    let url
    if (this.library) {
      url = `${baseUrl}/libraries/${this.row.libraryId}/preview`
    } else if (this.linkId) {
      url = `${baseUrl}/shares/${this.linkId}/files/${this.row.id}/preview`
    } else url = `${baseUrl}/files/${this.row.id}/preview`
    this.src = url
    // this.loading = true
    // previewFile(this.row.id).then(data => {
    //   this.src = URL.createObjectURL(new Blob([data]))
    // }).catch((e) => {
    //   this.close()
    // }).finally(() => {
    //   this.loading = false
    // })
  }

  // beforeDestroy () {
  //   if (this.src) window.URL.revokeObjectURL(this.src) // 释放掉blob对象
  // }
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
  background-color: rgba(0, 0, 0, .85);
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
  color: #fff;
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
