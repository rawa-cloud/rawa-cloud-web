<template>
    <div>
        <div :class="[$style.header]" class="text-right m-2">
            <v-button color="primary" type="text" icon="delete" @click="onClear">清空回收站</v-button>
        </div>

        <config-table row-key="id" :api="api" height="calc(100vh - 300px)" ref="configTable">
          <template slot="extra" slot-scope="{rows}">
            <v-button color="primary" icon="delete" :disabled="rows.length < 1" @click="onDelete(rows)">删除</v-button>
            <v-button color="primary" :disabled="rows.length < 1" class="ml-2" icon="recover" @click="onRecover(rows)">恢复</v-button>
          </template>
          <v-table-column prop="name" label="文件名">
              <template slot-scope="{row}">
                  <file-icon v-bind="iconProps(row)"></file-icon>
                  <span class="ml-2">{{row.name}}</span>
              </template>
            </v-table-column>
            <v-table-column prop="path" label="路径"></v-table-column>
            <v-table-column prop="size" label="大小">
              <template slot-scope="{row}"><span v-if="!row.dir">{{row.size | size}}</span></template>
            </v-table-column>
            <v-table-column prop="creationTime" label="删除时间"></v-table-column>
            <v-table-column prop="creationBy" label="删除人"></v-table-column>
            <v-table-column prop="opt" label="操作" fixed="right" width="80px">
                <template slot-scope="{row}">
                    <span class="icon-btn" @click="onDelete(row.id)"><v-icon type="delete"></v-icon></span>
                    <span class="ml-3 icon-btn" @click="onRecover(row.id)"><svg-icon icon="recover"></svg-icon></span>
                </template>
            </v-table-column>
        </config-table>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { queryRecycles, deleteRecycles, recoverRecycles, clearRecycle } from '@/api/recycle'

function generateIds (ids: any | any[]) {
  if (typeof ids === 'number') return [ids]
  return (ids || []).map((v: any) => {
    if (typeof v === 'number') return v
    return v.id
  })
}

@Component
export default class Recycle extends Vue {
  api = queryRecycles

  iconProps (row: any) {
    let dir = row.dir
    let personal = false
    let root = false
    let contentType = row.contentType
    return { dir, personal, root, contentType }
  }

  onDelete (ids: any | any[]) {
    this.$modal.confirm({ title: '确认', content: '确认删除文件，删除后将不能恢复？' }).then(() => {
      deleteRecycles(generateIds(ids)).then(() => {
        this.refresh()
      })
    })
  }

  onRecover (ids: any | any[]) {
    this.$modal.confirm({ title: '确认', content: '确认恢复文件？' }).then(() => {
      recoverRecycles(generateIds(ids)).then(() => {
        this.refresh()
      })
    })
  }

  onClear () {
    this.$modal.confirm({ title: '确认', content: '确认清空回收站，清空后将不能恢复？' }).then(() => {
      clearRecycle().then(() => {
        this.refresh()
      })
    })
  }

  onQuery () {
    this.query({})
  }

  query (params: any) {
    const $e = (this as any).$refs.configTable
    if ($e) $e.query(params)
  }

  refresh () {
    const $e = (this as any).$refs.configTable
    $e.refresh()
    const $c = (this as any).$refs.configTable as any
    $c.onClearSelection()
  }

  mounted () {
    this.onQuery()
  }
}
</script>

<style lang="scss" module>
.header {
}
</style>
