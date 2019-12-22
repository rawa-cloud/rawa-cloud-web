<template>
  <div :class="[$style.container]">
    <viewer :images="images" @inited="inited" :options="options" @hidden.native="onHidden">
      <img v-for="src in images" :src="src" :key="src" style="display: none;">
    </viewer>
    <!-- <div :class="[$style.close]" @click="onClose"><v-icon type="close-circle-o"></v-icon></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import BasePreview from '../BasePreview'
import { previewFile } from '@/api/file'
import { getType } from '@/common/content-type'

const baseUrl = process.env.VUE_APP_API_BASE_URL

@Component
export default class ImagePreview extends mixins(BasePreview) {
  options = {
    backdrop: 'static'
  }

  get ids (): number[] {
    let id = this.row && this.row.id
    return (this.rows || [])
      .filter((v: any) => getType(v.contentType) === 'image')
      .map((v: any) => v.id).sort((a: number, b: number) => {
        return a === id ? -1 : 0
      })
  }

  get images (): string[] {
    return this.ids.map(v => {
      return `${baseUrl}/files/${v}/preview`
    })
  }

  inited (viewer: any) {
    viewer.show(0)
  }

  onClose () {
    this.close()
  }

  onHidden () {
    this.close()
  }

  // beforeDestroy () {
  //   this.images.forEach(v => {
  //     window.URL.revokeObjectURL(v)
  //   })
  // }
}
</script>

<style lang="scss" module>
.container {
  position: fixed;
  z-index: 2014;
  left: 0;
  top: 0;
  // height: 100vh;
  // width: 100vw;
  // background-color: rgba(0,0,0,0);
  padding: 2rem;
}

.close {
  position: absolute;
  right: .5rem;
  top: .5rem;
  font-size: 2rem;
  cursor: pointer;
}
</style>
