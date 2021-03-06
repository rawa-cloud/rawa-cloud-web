<template>
    <div>
        <v-table :data-source="dataSource"  :class="[$style.table]"
            @selection-change="onSelectionChange" height="calc(100vh - 260px)" ref="table">
            <v-table-column type="selection" fixed="left" width="80px"></v-table-column>
            <v-table-column prop="name" label="文件名" width="480px">
                <template slot-scope="{row}">
                    <file-icon v-bind="iconProps(row)"></file-icon>
                    <span class="ml-2 text-link" @click="onPreview(row)">{{row.name}}</span>
                </template>
            </v-table-column>
            <v-table-column prop="size" label="大小"></v-table-column>
            <v-table-column prop="lastChangeTime" label="修改日期"></v-table-column>
            <v-table-column prop="umask" label="权限"></v-table-column>
            <v-table-column column-key="opt" label="操作" fixed="right" width="120px">
                <template slot-scope="{row}">
                    <span class="mr-2 icon-btn"><v-icon type="share-alt"></v-icon></span>
                    <span class="mr-2 icon-btn" @click="onDownload(row)"><v-icon type="cloud-download-o"></v-icon></span>
                    <v-dropdown trigger="click" class="d-inline">
                        <span class="icon-btn"><v-icon type="ellipsis"></v-icon></span>
                        <v-dropdown-menu slot="dropdown" class="w-6">
                            <v-dropdown-item>移动到</v-dropdown-item>
                            <v-dropdown-item>复制到</v-dropdown-item>
                            <v-dropdown-item @click.native="onRename(row)">重命名</v-dropdown-item>
                            <v-dropdown-item @click.native="onDelete(row)">删除</v-dropdown-item>
                        </v-dropdown-menu>
                    </v-dropdown>
                </template>
            </v-table-column>
        </v-table>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit, Watch, Inject } from 'vue-property-decorator'

@Component
export default class FileList extends Vue {
    @Prop(Array) dataSource!: any[]

    @Prop(Array) checkedRows!: any[]

    @Emit('update:checked-rows') updateCheckedRows (files: any) {}

    @Inject() onPreview!: (row: any) => void

    @Inject() onDownload!: (row: any) => void

    @Inject() onDelete!: (row: any) => void

    @Inject() onRename!: (row: any) => void

    onSelectionChange (rows: any[]) {
      if (isSameArray(rows, this.checkedRows)) return
      this.updateCheckedRows(rows)

      function isSameArray (a: any[], b: any[]) {
        if (a.length !== b.length) return false
        let s2 = new Set(b)
        return a.every(v => s2.has(v))
      }
    }

    iconProps (row: any) {
      let dir = row.dir
      let personal = row.personal
      let root = false
      let contentType = row.contentType
      return { dir, personal, root, contentType }
    }

    syncCheckRows () {
      const $e = this.$refs.table as any
      if (!$e) return
      $e.selectionKeySet.clear()
      this.checkedRows.forEach((v: any) => {
        $e.selectionKeySet.add(v)
      })
    }

    mounted () {
      this.syncCheckRows()
    }

    @Watch('checkedRows') checkedRowsChange () {
      this.syncCheckRows()
    }
}
</script>

<style lang="scss" module>
.table {
    // font-size: 12px;
}
</style>
