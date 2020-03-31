<template>
    <div>
        <div class="d-flex justify-content-between align-content-center m-2" v-if="!simple">
            <div style="flex: 1 1 auto;">
              <v-alert type="info" v-if="checkable">
                <template slot="description">
                      已选择 <span>{{checkedRows.length}}</span> 项
                      <a class="ml-2" @click="onClearSelection">清空选择</a>
                  </template>
              </v-alert>
            </div>
            <div class="ml-3">
                <slot name="extra" :rows="checkedRows"></slot>
                <v-button color="primary" icon="filter" @click="onFilter" v-if="storageKey">筛选列</v-button>
            </div>
        </div>

        <v-table pageable remote :row-key="rowKey" v-bind="remoteData" ref="table"
          @current-page-change="onCurrentPageChange"
          @page-size-change="onPageSizeChange"
          @selection-change="onSelectionChange" :height="height" :size="size">
            <v-table-column type="selection" fixed="left" width="80px" v-if="!simple && checkable" :order="-1"></v-table-column>
            <v-table-column :prop="i + '__config_table__'" :label="col.label" :order="i + 10" v-for="(col, i) in renderedColumns" :key="i">
            <template slot-scope="{row}">
              <template v-if="col.formatter">{{col.formatter(col.name, row)}}</template>
              <template v-else>{{row[col.name]}}</template>
            </template>
            </v-table-column>
            <slot></slot>
        </v-table>

        <column-filter ref="columnFilter"></column-filter>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { Pageable, Page } from '@/api'
import ColumnFilter from './column-filter/index.vue'
import storage from './storage'

export interface Column {
  name?: string
  label: string
  order?: number
  formatter?: (row: any) => string
}

@Component({
  components: { ColumnFilter }
})
export default class ConfigTable extends Vue {
    @Prop(String) storageKey!: string

    @Prop(String) rowKey!: string

    @Prop() columns!: any[]

    @Prop() api!: (params: Pageable) => Promise<Page<any>>

    @Prop() height!: string

    @Prop(Boolean) simple!: string

    @Prop(String) size!: string

    @Prop({ type: Boolean, default: true }) checkable!: boolean

    checkedRows: any = []

    seq: number = 1

    params: any = null

    remoteData: any = {
      dataSource: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      sorter: null,
      filters: [],
      loading: false
    }

    get excludes (): any[] {
      return this.storageKey ? (storage.get(this.storageKey) || []) : []
    }

    set excludes (value: any[]) {
      if (!this.storageKey) return
      storage.set(this.storageKey, value)
    }

    get renderedColumns () {
      return (this.columns || []).filter((v: any) => !this.excludes.includes(v.name))
    }

    onSelectionChange (rows: any[]) {
      this.checkedRows = rows || []
    }

    onClearSelection () {
      this.checkedRows = []
      const $e = this.$refs.table as any
      if (!$e) return
      $e.selectionKeySet.clear()
    }

    onCurrentPageChange (currentPage: number) {
      const p = this.remoteData.pagination
      this.loadData(currentPage, p.pageSize, this.params)
    }

    onPageSizeChange (pageSize: number) {
      this.loadData(1, pageSize, this.params)
    }

    onFilter () {
      const $e = (this as any).$refs.columnFilter as ColumnFilter
      let dataSource = this.columns.map((v: any) => {
        return {
          key: v.name,
          label: v.label
        }
      })
      $e.select(dataSource, this.excludes).then(data => {
        this.excludes = data
      })
    }

    query (params: Record<string, any> = {}) {
      this.params = params
      this.loadData(1, this.remoteData.pagination.pageSize, params)
    }

    refresh () {
      const p = this.remoteData.pagination
      this.loadData(p.currentPage, p.pageSize, this.params)
    }

    loadData (page: number, size: number, params?: Record<string, any>) {
      this.remoteData.loading = true
      this.seq++
      let seq = this.seq
      let req = Object.assign(params || {}, { page: page - 1, size })
      this.api(req).then(data => {
        if (seq !== this.seq) return Promise.resolve()
        this.remoteData.pagination.currentPage = data.number + 1
        this.remoteData.pagination.pageSize = data.size
        this.remoteData.pagination.total = data.totalElements
        this.remoteData.dataSource = data.content
      }).finally(() => {
        if (this.seq === seq) this.remoteData.loading = false
      })
    }
}
</script>

<style lang="scss" module>
.header {
}
</style>
