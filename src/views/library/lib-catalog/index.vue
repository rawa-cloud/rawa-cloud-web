<template>
<div>
  <div :class="[$style.header]">库列表</div>
  <ul :class="[$style.list]">
    <li :class="[$style.item, isActiveCls(row)]" v-for="(row, i) in data" :key="i" @click="onSelect(row)">{{row.name}}</li>
  </ul>
</div>
</template>

<script lang="ts">

import { Vue, Component, Provide, Inject } from 'vue-property-decorator'
import { queryLibCatalogs } from '@/api/library'

@Component
export default class LibCatalog extends Vue {
  data: any[] = []

  @Inject() getCurrent!: () => any

  @Inject() setCurrent!: (row: any) => void

  isActiveCls (row: any) {
    let current = this.getCurrent()
    let active = current && (current === row || current.id === row.id)
    return active ? (this as any).$style.isActive : ''
  }

  onSelect (row: any) {
    this.setCurrent(row)
  }

  loadData () {
    queryLibCatalogs().then(data => {
      this.data = data || []
    })
  }

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
.header {
  line-height: 32px;
  padding: 0 8px;
  background-color: var(--bg-color-2);
}

.list {
  list-style: none;
  padding: 8px 0;
  margin: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  height: 28px;
  align-items: center;
  padding: 0 12px;
  border-radius: 2px;

  &:hover {
    background-color: var(--bg-color-2);
    cursor: pointer;
  }
}

.isActive {
  background-color: var(--primary-lighten-4);
}
</style>
