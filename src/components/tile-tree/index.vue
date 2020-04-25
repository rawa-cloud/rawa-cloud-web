<template>
  <div :class="[$style.container]">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch, Provide } from 'vue-property-decorator'
import Node from './Node'

@Component
export default class TileTree extends Vue {
  @Prop(String) rowKey!: string

  @Prop(Array) data!: any[]

  root: Node | null = null

  @Watch('data', { immediate: true }) dataChange (data: any[]) {
    let current = this.root && this.root.current
    this.root = new Node(data || [], null, this.rowKey)
    if (current) {
      this.root.setCurrent(current)
    }
  }

  @Provide() getList (level: number = 1) {
    if (!this.root || level < 1) return []
    if (level === 1) return this.root.children || []
    if (!this.root.current) return []
    const lv = this.root.current.level
    const current = this.root.current as Node
    if (lv === level) return (current.parent as Node).children || []
    if (lv === level - 1) return current.children || []
    if (lv > level) {
      let target: any = current
      while (target) {
        if (target.level === level - 1) break
        target = target.parent
      }
      if (target) return target.children || []
    }
    return []
  }

  @Provide() getCurrent () {
    return (this.root && this.root.current) || null
  }
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  height: 100%;
}
</style>
