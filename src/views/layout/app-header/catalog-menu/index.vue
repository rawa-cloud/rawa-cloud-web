<template>
 <ul :class="[$style.list]">
  <li :class="[$style.item, activeCls(row.active)]" v-for="row in rows" :key="row.label" @click="onFroward(row.url)">{{row.label}}</li>
</ul>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { isAdminUrl } from '@/helpers/context'

@Component
export default class CatalogMenu extends Vue {
  get rows () {
    const ret = [
      {
        label: '公司文档',
        active: !this.isAdmin,
        url: '/file'
      }
    ]
    if (this.$auth.hasRole('SUPER')) {
      ret.push({
        label: '后台管理',
        active: this.isAdmin,
        url: '/dept'
      })
    }
    return ret
  }

  get isAdmin () {
    return isAdminUrl(this.$route)
  }

  onFroward (url: string) {
    this.$router.push(url)
  }

  activeCls (active: boolean) {
    return active ? this.$style.active : ''
  }

  $style!: any
}
</script>

<style lang="scss" module>
.list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  height: 100%;
}

.item {
  height: 64px;
  line-height: 64px;
  vertical-align: bottom;
  font-size: 16px;
  padding: 0 12px ;
  color: var(--text-color);
  border-bottom: 4px solid transparent;

  &:hover, &.active {
    color: var(--primary-base);
    cursor: pointer;
  }

  &.active {
    border-bottom-color: var(--primary-base);
  }
}
</style>
