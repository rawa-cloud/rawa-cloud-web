<template>
  <div :class="[$style.container]">
    <div :class="[$style.header]">
      <div class="text-heading">{{title}}</div>
      <div class="icon-btn ft-lg" v-if="addable" :disabled="disabled" @click="onAdd"><v-icon type="plus-circle-o"></v-icon></div>
    </div>
    <ul :class="[$style.list]">
      <li :class="[$style.item, itemActiveCls(node), itemParentCls(node)]" v-for="(node, i) in rows" :key="i" @click="onSelect(node)">
        <div><slot :node="node">{{node.data.name}}</slot></div>
        <div>
          <slot name="action" :node="node"></slot>
          <span class="icon-btn" @click="onEdit(node)"> <v-icon type="edit"></v-icon></span>
          <span class="icon-btn ml-2" @click="onDel(node)"> <v-icon type="delete"></v-icon></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Inject, Emit } from 'vue-property-decorator'
import Node from '../Node'

@Component
export default class TileTreeColumn extends Vue {
  @Prop(String) title!: string

  @Prop({ type: Boolean, default: true }) addable!: boolean

  @Prop() addFn!: (parent: Node) => boolean

  @Prop(Number) level!: number

  @Inject() getList!: (level: number) => Node[]

  @Inject() getCurrent!: () => Node | null

  @Emit() add (node: Node | null) {}

  @Emit() edit (node: Node) {}

  @Emit() del (node: Node) {}

  get rows () {
    if (!this.level) return []
    return this.getList(this.level)
  }

  get current () {
    return this.getCurrent()
  }

  get parent () {
    let node: any = null
    if (this.current && this.level > 1) {
      let temp = this.current as any
      while (temp) {
        if (temp.level === this.level - 1) break
        temp = temp.parent
      }
      node = temp
    }
    return node
  }

  get originDisabled () {
    if (this.level === 1) return false
    if (!this.current) return true
    return this.current.level < this.level - 1
  }

  get disabled () {
    return this.originDisabled || (this.addFn && this.addFn(this.parent))
  }

  itemActiveCls (node: Node) {
    return node.isCurrentNode() ? (this as any).$style.isActive : ''
  }

  itemParentCls (node: Node) {
    return node.isParentNode() ? (this as any).$style.isParent : ''
  }

  onSelect (node: Node) {
    node.setCurrent(node)
  }

  onAdd () {
    if (this.disabled) return
    this.add(this.parent)
  }

  onEdit (node: Node) {
    this.edit(node)
  }

  onDel (node: Node) {
    this.del(node)
  }
}
</script>

<style lang="scss" module>
.container {
  min-width: calc(33.33% - 20px);
  flex: 10 0 auto;
  border-radius: 4px;
  border: 1px solid var(--border-color-base);
  margin: 0 10px;
  height: calc(100vh - 160px);
  overflow: auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 12px;
  height: 48px;
  border-bottom: 1px solid var(--border-color-split);
}

.list {
  list-style: none;
  padding: 4px 0;
  margin: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  height: 28px;
  align-items: center;
  margin: 0 12px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 4px;

  &:hover {
    background-color: var(--primary-lighten-5);
    cursor: pointer;
  }
}

.isParent {
  border: 1px solid var(--border-color-base);
}

.isActive {
  border: 1px solid var(--primary-base);
}
</style>
