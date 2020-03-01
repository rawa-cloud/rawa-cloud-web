<template>
    <div>
        <div>
            <v-form layout="horizontal" class="mx-3 mt-3" :model="form" ref="form">
                <v-form-item prop="name" label="名称">
                    <v-input v-model.trim="form.name" clearable class="w-10"></v-input>
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
            <v-table pageable :data-source="dataSource" height="calc(100vh - 330px)">
              <v-table-column prop="name" label="文件名" width="480px">
                  <template slot-scope="{row}">
                    <file-icon v-bind="iconProps(row)"></file-icon>
                    <span class="ml-2 text-link">{{row.name}}</span>
                  </template>
              </v-table-column>
              <v-table-column prop="size" label="大小">
                <template slot-scope="{row}">
                  <template v-if="row.dir"></template>
                  <template v-else>{{row.size | size}}</template>
                </template>
              </v-table-column>
              <v-table-column prop="creationTime" label="创建日期"></v-table-column>
              <v-table-column prop="creationBy" label="日创建人期"></v-table-column>
              <v-table-column prop="filePath" label="原文件路径">
                <template slot-scope="{row}"><a @click="onForward(row.id, row.parentId)">{{row.filePath}}</a></template>
              </v-table-column>
            </v-table>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Watch } from 'vue-property-decorator'
import { queryUsers } from '@/api/user'
import { searchFiles, getFile } from '@/api/file'
import { normalizeDate } from '@/helpers/date'

@Component
export default class Search extends Vue {
    form = {
      name: '',
      creationBy: '',
      creationTime: [],
      get creationTimeStart () {
        return normalizeDate(this.creationTime[0])
      },
      get creationTimeEnd () {
        return normalizeDate(this.creationTime[1])
      }
    }

    loading: boolean = false

    dataSource: any[] = []

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

    onQuery () {
      this.query()
    }

    onReset () {
      const $form = this.$refs.form as any
      $form.resetFields()
    }

    query () {
      this.loading = true
      let req = Object.assign({}, this.form, { creationTime: undefined })
      searchFiles(req).then(data => {
        this.dataSource = data || []
      }).finally(() => {
        this.loading = false
      })
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

    mounted () {
      this.query()
    }

    @Watch('name', { immediate: true }) nameChange (name: string) {
      if (name) {
        this.form.name = name
        this.query()
      }
    }
}
</script>
