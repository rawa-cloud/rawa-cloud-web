<template>
 <ul :class="[$style.list]">
  <li :class="[$style.item]" v-for="row in rows" :key="row.label">{{row.label}}</li>
</ul>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'

@Component
export default class CatalogMenu extends Vue {
  rows = [
    {
      label: '公司文档'
    },
    {
      label: '后台管理'
    }
  ]
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
  border-bottom: 2px solid transparent;
  line-height: 62px;
  vertical-align: bottom;
  font-size: 18px;
  margin: 0 12px;

  &:hover {
    color: var(--primary-base);
    cursor: pointer;
  }

  &.active {
    color: var(--primary-base);
    border-bottom-color: var(--primary-base);
  }
}
</style>
