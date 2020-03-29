<template>
<div :class="[$style.container]">
  <!-- <lib-catalog :class="[$style.sider]"></lib-catalog> -->
  <lib-result :class="[$style.content]"></lib-result>
</div>
</template>

<script lang="ts">

import { Vue, Component, Provide, Watch } from 'vue-property-decorator'
import LibCatalog from './lib-catalog/index.vue'
import LibResult from './lib-result/index.vue'
import { queryLibCatalog } from '@/api/library'

@Component({
  components: { LibCatalog, LibResult }
})
export default class Library extends Vue {
  current: any = null

  get id () {
    return +this.$route.params.id
  }

  @Provide() setCurrent (row: any) {
    this.current = row || null
  }

  @Provide() getCurrent () {
    return this.current
  }

  @Watch('id', { immediate: true }) idChange () {
    queryLibCatalog(this.id).then(data => {
      this.setCurrent(data)
    })
  }
}
</script>

<style lang="scss" module>
.container {
  display: flex;
  height: calc(100vh - 150px);
}

.content {
  width: 100%;
  height: 100%;
  overflow: auto;
}

</style>
