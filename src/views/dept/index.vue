<template>
    <div :class="[$style.container]" class="mx-3">
        <dept-tree :id.sync="id" :class="[$style.tree]" class="mr-3"></dept-tree>
        <dept-detail :id="id" :class="[$style.detail]"></dept-detail>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import DeptTree from './dept-tree/index.vue'
import DeptDetail from './dept-detail/index.vue'

@Component({
  components: { DeptTree, DeptDetail }
})
export default class Dept extends Vue {
  id: number | null = null
}
</script>

<style lang="scss" module>
.container{
    display: flex;
}

.tree {
  width: 320px;
  box-shadow: 2px 0 4px var(--bg-color-1);
  height: calc(100vh - 64px - 8px);
  overflow: auto;
}

.detail {
  height: calc(100vh - 64px - 8px);
  overflow: auto;
  flex: 1 1 auto;
}
</style>
