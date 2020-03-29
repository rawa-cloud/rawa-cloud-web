<template>
  <v-tree node-key="id" :data-source="dataSource" ref="tree" :class="[$style.tree]">
      <div slot="content"  slot-scope="{node}" @click="onSelect(node)" :class="[$style.content]" class="d-flex justify-content-between">
          <span class="mr-4">{{node.data.label}}</span>
          <div @click.stop="" class="_flag_actions">
              <span class="icon-btn" @click="onViewUser(node.data)"><a>选择用户</a></span>
          </div>
      </div>
  </v-tree>
</template>

<script lang="ts">

import { Vue, Component, Emit, Prop } from 'vue-property-decorator'
import { queryDepts, deleteDept } from '@/api/dept'
import { toCascade } from '@/helpers/data'

const mapper = (dept: any) => {
  let ret: any = {
    get key () {
      return dept.id
    },
    get label () {
      return dept.name
    }
  }
  return Object.assign(ret, dept)
}

@Component
export default class DeptTree extends Vue {
    @Prop(Number)id!: number

    dataSource: any[] = []

    @Emit() viewUser (dept: any) {}

    @Emit() select (dept: any) {}

    onViewUser (dept: any) {
      this.viewUser(dept)
    }

    onSelect (node: any) {
      this.select(node.data)
    }

    onExpand () {
      const $e = this.$refs.tree as any
      $e.expandAll(true)
    }

    loadDepts () {
      return queryDepts({}).then(data => {
        this.dataSource = toCascade((data || []).map(mapper))
      })
    }

    mounted () {
      this.loadDepts().then(() => {
        this.$nextTick(() => {
          this.onExpand()
        })
      })
    }
}
</script>

<style lang="scss" module>
.container {
    min-height: calc(100vh - 160px);
}

.toolbar {
    background-color: var(--bg-color-2);
    line-height: 2rem;
    height: 2rem;
}

.tree {
    :global {
        .v-tree-node__text:hover {
            ._flag_actions {
                visibility: visible;
            }
        }
        .v-tree-node__text {
            ._flag_actions {
                visibility: hidden;
            }
        }
    }
}

.content {
    // width: 240px;
}
</style>
