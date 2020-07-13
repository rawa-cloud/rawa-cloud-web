<template>
  <div :class="[$style.container]">
    <viewer :images="auctualImages" @inited="inited" :options="options" @hidden.native="onHidden">
      <template slot-scope="{images}">
      <img v-for="(src, i) in images" :src="src" :key="i" style="display: none;">
      </template>
    </viewer>
    <!-- <div :class="[$style.close]" @click="onClose"><v-icon type="close-circle-o"></v-icon></div> -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import BasePreview from '../BasePreview'
import { getType } from '@/common/content-type'

const baseUrl = process.env.VUE_APP_API_BASE_URL

@Component
export default class ImagePreview extends mixins(BasePreview) {
  options = {
    backdrop: 'static',
    viewed: this.viewed
  }

  auctualImages: any[] = []

  index = 0

  get ids (): number[] {
    let id = this.row && this.row.id
    if (this.library) return [this.row.libraryId]
    return (this.rows || [])
      .filter((v: any) => getType(v.contentType) === 'image')
      .map((v: any) => v.id).sort((a: number, b: number) => {
        return a === id ? -1 : 0
      })
  }

  get images (): string[] {
    return this.ids.map(v => {
      let url
      if (this.library) {
        url = `${baseUrl}/libraries/${this.row.libraryId}/preview`
      } else if (this.linkId) {
        url = `${baseUrl}/shares/${this.linkId}/files/${v}/preview?password=${this.password}`
      } else url = `${baseUrl}/files/${v}/preview`
      return url
    })
  }

  inited (viewer: any) {
    viewer.show()
  }

  viewed (e: any) {
    const num = 10
    this.index = e.detail.index
    if (this.auctualImages.length >= this.images.length) return
    if (this.auctualImages.length < this.index + num) {
      const max = this.auctualImages.length
      this.auctualImages.push(...this.images.slice(max, max + num))
    }
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
  @Watch('images', { immediate: true }) imageChange () {
    this.auctualImages.push(this.images[0])
  }
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
