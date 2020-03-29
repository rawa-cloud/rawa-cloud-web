<template>
    <div>
        <v-table :data-source="dataSource"  :class="[$style.table]" highlight-current-row
            @selection-change="onSelectionChange" height="calc(100vh - 260px)" @row-menu="onRowMenu" ref="table"
            @row-click="onRowClick" @row-dbclick="onRowDbclick">
            <v-table-column type="selection" fixed="left" width="80px"></v-table-column>
            <v-table-column prop="name" label="文件名" width="480px" sortable>
                <template slot-scope="{row}">
                   <file-icon v-bind="iconProps(row)"></file-icon>
                   <span class="ml-2 text-link" @click="onPreview(row)">{{row.name}}</span>
                   <v-icon type="info" class="ml-2" v-if="row.admin && !row.userId"></v-icon>
                </template>
            </v-table-column>
            <v-table-column prop="size" label="大小" sortable>
              <template slot-scope="{row}">
                <template v-if="row.dir"></template>
                <template v-else>{{row.size | size}}</template>
              </template>
            </v-table-column>
            <v-table-column prop="lastChangeTime" label="修改日期" sortable></v-table-column>
            <v-table-column prop="umask" label="权限">
              <template slot-scope="{row}">{{row.umask | umask}}</template>
            </v-table-column>
            <!-- <v-table-column column-key="opt" label="操作" fixed="right" width="120px">
                <template slot-scope="{row}">
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
            </v-table-column> -->
            <template slot="menu" slot-scope="{}">
                <v-dropdown-item @click.native="row.action()" v-for="(row, i) in menus" :key="i" :class="[$style.menu]">
                  <span> {{row.title}} </span>
                </v-dropdown-item>
                <!-- <v-dropdown-item @click.native="onDownload(row)">
                  <span><v-icon type="cloud-download-o"></v-icon> 下载 </span>
                </v-dropdown-item>
                 <v-dropdown-item>
                  <span><v-icon type="share-alt"></v-icon> 分享</span>
                </v-dropdown-item>
                <v-dropdown-item @click.native="onRename(row)">
                  <span><v-icon type="share-alt"></v-icon> 重命名</span>
                </v-dropdown-item>
                <v-dropdown-item @click.native="onDelete(row)">
                  <span><v-icon type="share-alt"></v-icon> 删除</span>
                </v-dropdown-item> -->
            </template>
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

    @Inject() filterActions!: (row?: any) => any[]

    timestamp: number = Date.now()

    get menus () {
      return this.filterActions()
    }

    onSelectionChange (rows: any[]) {
      if (isSameArray(rows, this.checkedRows)) return
      this.updateCheckedRows(rows)

      function isSameArray (a: any[], b: any[]) {
        if (a.length !== b.length) return false
        let s2 = new Set(b)
        return a.every(v => s2.has(v))
      }
    }

    onRowMenu (row: any) {
      const $e = (this.$refs as any).table
      if ($e.hasSelection(row)) return
      $e.resetSelection()
      $e.selectRow(row, true)
    }

    onRowClick (row: any) {
      const timestamp = Date.now()
      this.timestamp = timestamp
      setTimeout(() => { // 排除双击操作
        if (timestamp !== this.timestamp) {
          this.timestamp = Date.now()
          return
        }
        const $e = this.$refs.table as any
        if ($e.hasSelection(row)) {
          $e.selectRow(row, false)
        } else {
          $e.selectRow(row, true)
        }
      }, 350)
    }

    onRowDbclick (row: any) {
      this.onPreview(row)
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

.menu {
  width: 120px;
  padding-left: 32px;
}
</style>
