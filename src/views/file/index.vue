<template>
    <div :class="[$style.container]">
        <file-tree :id.sync="id" :class="[$style.tree]" ref="fileTree"></file-tree>
        <file-result :parent-id="id" :class="[$style.result]" v-if="id"></file-result>
        <div class="mt-5 text-center" style="width: 100%;" v-else>
          <no-data></no-data>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Provide } from 'vue-property-decorator'
import FileTree from './file-tree/index.vue'
import FileResult from './file-result/index.vue'

@Component({
  components: { FileTree, FileResult }
})
export default class Dept extends Vue {
  get id (): number {
    return (+(this.$route.query && this.$route.query.id) || null) as any
  }

  set id (id: number) {
    this.$router.push({ path: '/file', query: { id: String(id) } })
  }

  @Provide() reload (id?: number) {
    const $e = this.$refs.fileTree as any
    let actualId = id || this.id
    if ($e) $e.reload(actualId)
  }
}
</script>

<style lang="scss" module>
.container{
    display: flex;
}

.tree {
    width: 240px;
    overflow: auto;
}

.result {
    width: calc(100% - 240px);
}
</style>
