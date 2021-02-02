<template>
    <div class="mx-3">
        <div>
            <v-form layout="horizontal" :model="form" ref="form">
                <v-form-item prop="name" label="名称">
                    <v-input v-model.trim="form.name" clearable class="w-10"></v-input>
                </v-form-item>
                <v-form-item prop="tags" label="标签">
                    <v-input v-model.trim="form.tags" clearable class="w-10"></v-input>
                </v-form-item>
                <v-form-item prop="leader" label="负责人">
                    <v-select v-model="form.leader" clearable searchable class="w-10">
                      <dict-option name="user"></dict-option>
                    </v-select>
                </v-form-item>
                <v-form-item prop="location" label="所属辖区">
                  <v-select v-model="form.location" clearable searchable class="w-10">
                      <dict-option name="location"></dict-option>
                    </v-select>
                </v-form-item>
                <v-form-item prop="unit" label="所属单元">
                  <v-select v-model="form.unit" clearable searchable class="w-10">
                    <dict-option name="unit"></dict-option>
                  </v-select>
                </v-form-item>
                <v-form-item prop="keyUnit" label="重点单元">
                  <v-select v-model="form.keyUnit" clearable searchable class="w-10">
                    <dict-option name="keyUnit"></dict-option>
                  </v-select>
                </v-form-item>
                <v-form-item prop="creationBy" label="创建人">
                  <v-input v-model.trim="form.creationBy" clearable class="w-10"></v-input>
                </v-form-item>
                <v-form-item prop="creationTime" label="创建时间">
                  <v-range-picker v-model="form.creationTime" start-placeholder="开始日期" end-placeholder="结束日期" clearable></v-range-picker>
                </v-form-item>
                <!-- <v-form-item prop="contentType" label="文件后缀">
                    <v-input v-model.trim="form.contentType" clearable class="w-10"></v-input>
                </v-form-item> -->

                <v-form-item >
                   <v-button type="primary" @click="onQuery">查询</v-button>
                   <v-button class="ml-3" @click="onReset">重置</v-button>
                </v-form-item>
            </v-form>
        </div>

        <div>
            <div class="ft-sm d-flex justify-content-between">
              <span>
                <v-button type="text" size="sm" class="link-btn" :disabled="checkedRows.length < 1" @click="onBatchDownload">
                  <v-icon type="download"></v-icon> <span>下载</span>
                </v-button>
              </span>
              <span class="caption">
                <span> 已选择 {{checkedRows.length}} 项</span>
                <a class="ml-2" @click="onClearSelection">清空选择</a>
              </span>
            </div>
            <config-table row-key="id" size="sm" :class="[$style.table]" :api="api" simple height="calc(100vh - 64px - 8px - 62px - 160px)" ref="configTable">
              <v-table-column type="selection" fixed="left" width="64px"></v-table-column>
              <v-table-column prop="name" label="文件名" width="420px">
                  <div slot-scope="{row}" :class="[$style.label]">
                    <file-icon v-bind="iconProps(row)" :class="[$style.icon]"></file-icon>
                    <span class="ml-2 text-link">{{row.name}}</span>

                    <v-button size="sm" class="ml-2" @click="onPreview(row)" v-if="canPreview(row)">预览</v-button>
                    <v-button size="sm" class="ml-2" @click="onDownload(row)" v-if="canDownload(row)">下载</v-button>
                  </div>
              </v-table-column>
              <v-table-column prop="tags" label="标签">
                <template slot-scope="{row}">
                  <v-tag v-for="(t, i) in row._tags" :key="i"> {{t}} </v-tag>
                </template>
              </v-table-column>
             <v-table-column prop="leader" label="负责人">
                <template slot-scope="{row}">{{text('user', row.leader)}}</template>
              </v-table-column>
              <v-table-column prop="location" label="所属辖区">
                <template slot-scope="{row}">{{text('location', row.location)}}</template>
              </v-table-column>
              <v-table-column prop="unit" label="所属单位">
                <template slot-scope="{row}">{{text('unit', row.unit)}}</template>
              </v-table-column>
              <v-table-column prop="keyUnit" label="重点单位">
                <template slot-scope="{row}">{{text('keyUnit', row.keyUnit)}}</template>
              </v-table-column>
              <v-table-column prop="size" label="大小">
                <template slot-scope="{row}">
                  <template v-if="row.dir"></template>
                  <template v-else>{{row.size | size}}</template>
                </template>
              </v-table-column>
              <v-table-column prop="creationTime" label="创建日期"></v-table-column>
              <v-table-column prop="creationBy" label="创建人"></v-table-column>
              <v-table-column prop="filePath" label="原文件路径" overflow="ellipsis" width="240px">
                <template slot-scope="{row}"><a @click="onForward(row.id, row.parentId)" :title="row.filePath">{{row.filePath}}</a></template>
              </v-table-column>
            </config-table>
        </div>

        <file-preview ref="filePreview"></file-preview>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Watch } from 'vue-property-decorator'
import { queryUsers } from '@/api/user'
import { searchFiles, getFile, downloadFile } from '@/api/file'
import { download } from '@/helpers/download'
import { normalizeDate } from '@/helpers/date'
import { UMASK, hasAllAuthority, hasAnyAuthority } from '@/common/umask'
import { getDictLabel } from '@/common/dict'

@Component
export default class Search extends Vue {
    api = searchFiles

    form = {
      name: '',
      creationBy: '',
      creationTime: [],
      get creationTimeStart () {
        return normalizeDate(this.creationTime[0])
      },
      get creationTimeEnd () {
        return normalizeDate(this.creationTime[1])
      },
      leader: '',
      location: '',
      unit: '',
      keyUnit: '',
      tags: ''
    }

    loading: boolean = false

    dataSource: any[] = []

    checkedRows: any[] = []

    get name () {
      return this.$route.query.name || ''
    }

    iconProps (row: any) {
      let dir = row.dir
      let personal = row.personal
      let root = false
      let contentType = row.contentType
      return { dir, personal, root, contentType }
    }

    canPreview (row: any) {
      // return hasAnyAuthority(row.umask, UMASK.PREVIW.value)
      return true
    }

    canDownload (row: any) {
      // return hasAnyAuthority(row.umask, UMASK.DOWNLOAD.value)
      return true
    }

    onQuery () {
      this.query(this.form)
    }

    onReset () {
      const $form = this.$refs.form as any
      $form.resetFields()
    }

    query (params: any) {
      const $e = (this as any).$refs.configTable
      if ($e) $e.query(params)
    }

    onForward (id: number, parentId: number) {
      getFile(id).then(data => {
        if (!data || !data.status) {
          this.$message.error('文件已不存在')
          return
        }
        this.$router.push(`/file?id=${parentId}`)
      })
    }

    onPreview (row: any) {
      const $e = this.$refs.filePreview as any
      $e.preview(row, (this.$refs.configTable as any).remoteData.dataSource)
    }

    onDownload (row: any) {
      let file = row.file
      downloadFile(row.id).then(data => {
        download(data, row.dir ? `${row.name}.zip` : row.name)
      })
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

    onBatchDownload () {
      const ret = this.checkedRows.filter((v: any) => {
        return this.canDownload(v)
      })
      if (ret.length < 1) {
        this.$message.info('无可下载文件')
        return
      }
      this.$modal.confirm({
        title: '下载确认',
        content: `共 ${ret.length} 个可下载文件, 确认下载?`
      }).then(() => {
        ret.forEach((v: any) => {
          this.onDownload(v)
        })
      }).catch(() => {
        // ignore
      })
    }

    text (name: string, code: string) {
      return getDictLabel(name, code)
    }

    mounted () {
      this.onQuery()
    }

  // @Watch('name', { immediate: true }) nameChange (name: string) {
  //   if (name) {
  //     this.form.name = name
  //     this.query()
  //   }
  // }
}
</script>
<style lang="scss" module>
.label {
  display: flex;
  align-items: center;
}

.icon {
  font-size: 28px;
  margin: -4px 4px -4px 0;
}
</style>
