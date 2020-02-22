<template>
<div :class="[$style.container]">
  <lib-catalog :class="[$style.sider]"></lib-catalog>
  <lib-result :class="[$style.content]"></lib-result>
</div>
</template>

<script lang="ts">

import { Vue, Component, Provide } from 'vue-property-decorator'
import LibCatalog from './lib-catalog/index.vue'
import LibResult from './lib-result/index.vue'

@Component({
  components: { LibCatalog, LibResult }
})
export default class Library extends Vue {

}
</script>

<style lang="scss" module>
.container {
  display: flex;
}

.sider {
  width: 200px;
  border-right: 1px solid var(--border-color-split);
  height: calc(100vh - 140px);
  overflow: auto;
}

.content {
  width: calc(100% - 200px);
}

</style>
