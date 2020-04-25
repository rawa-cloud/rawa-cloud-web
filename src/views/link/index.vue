<template>
    <div class="mx-3">
        <config-table row-key="id" :api="api" height="calc(100vh - 64px - 8px - 32px - 70px)" ref="configTable" size="sm">
          <template slot="extra" slot-scope="{rows}">
            <v-button type="text" size="sm" class="link-btn" :disabled="rows.length < 1" @click="onCancel(rows)">
              <v-icon type="delete"></v-icon>
              取消分享
            </v-button>
          </template>
          <v-table-column prop="name" label="分享文件">
            <div slot-scope="{row}" :class="[$style.label]">
              <file-icon v-bind="iconProps(row)" :class="[$style.icon]"></file-icon>
              <span class="ml-2 text-link">{{row.fileName}}</span>
            </div>
          </v-table-column>
          <v-table-column prop="code" label="链接">
            <template slot-scope="{row}">
              <span>
                <a @click="onLink(row)">{{resolveLink(row)}}</a>
                <v-button type="outline" size="sm" class="ml-2" @click="onCopy(row)">复制</v-button>
              </span>
            </template>
          </v-table-column>
          <v-table-column prop="password" label="提取码"></v-table-column>
          <v-table-column prop="creationTime" label="分享时间"></v-table-column>
          <v-table-column prop="creationBy" label="分享人"></v-table-column>
          <v-table-column prop="expiryTime" label="失效时间"></v-table-column>
          <v-table-column prop="opt" label="操作" fixed="right" width="80px">
              <template slot-scope="{row}">
                  <span class="icon-btn" @click="onCancel(row.id)" title="删除"><v-icon type="delete"></v-icon></span>
              </template>
          </v-table-column>
        </config-table>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import { queryLinks, deleteLink } from '@/api/link'
import { copy } from '@/helpers/copy'

function generateIds (ids: any | any[]) {
  if (typeof ids === 'number') return [ids]
  return (ids || []).map((v: any) => {
    if (typeof v === 'number') return v
    return v.id
  })
}

@Component
export default class Link extends Vue {
  api = queryLinks

  onCancel (id: any) {
    let ids = generateIds(id)
    deleteLink(ids).then(() => {
      this.$message.success('已取消分享')
      this.refresh()
    })
  }

  iconProps (row: any) {
    let multiple = row.multiple
    let dir = multiple ? false : row.dir
    let personal = false
    let root = false
    let contentType = multiple ? 'multiple-share' : row.contentType
    return { dir, personal, root, contentType }
  }

  resolveName (row: any) {
    return (row.files && row.files[0] && row.files[0].name) + '...'
  }

  resolveLink (row: any) {
    return window.location.origin + `/#/share/${row.id}`
  }

  onLink (row: any) {
    this.$router.push(`/share/${row.id}`)
  }

  onCopy (row: any) {
    let url = this.resolveLink(row)
    copy(url)
    this.$message.success('已复制到剪切板')
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

.icon {
  font-size: 30px;
  margin: -4px 4px -4px 0;
}

.label {
  display: flex;
  align-items: center;
}
</style>
