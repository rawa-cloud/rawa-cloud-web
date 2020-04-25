<template>
    <div class="mx-3">
        <div>
            <v-form layout="horizontal" :model="form" ref="form">
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
            <v-table pageable :data-source="dataSource" size="sm" height="calc(100vh - 64px - 8px - 62px - 70px)">
              <v-table-column prop="name" label="文件名" width="480px">
                  <div slot-scope="{row}" :class="[$style.label]">
                    <file-icon v-bind="iconProps(row)" :class="[$style.icon]"></file-icon>
                    <span class="ml-2 text-link">{{row.name}}</span>
                  </div>
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
