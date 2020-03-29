<template>
<div :class="[$style.container]" v-if="file">
  <div class="d-flex">
    <div class="mx-3">
      <file-icon v-bind="iconProps" class="ft-64"></file-icon>
    </div>
    <v-form>
      <v-row :gutter="16">
        <v-col :span="8" v-for="row in rows" :key="row.key">
          <v-form-item :label="row.title">
            <span :class="[$style.item]">
              {{resolveText(row)}}
            </span>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>
  </div>
</div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import filters from '@/filters'

@Component
export default class EditDir extends Vue {
  @Prop() file!: any

  get dir () {
    return this.file && this.file.dir
  }

  get title () {
    return this.dir ? '文件夹详情' : '文件详情'
  }

  get rows () {
    let ret: any[] = [
      { key: 'name', title: '名称' },
      { key: 'id', title: 'ID' },
      { key: 'umask', title: '权限', filter: 'umask' },
      { key: 'creationBy', title: '创建人' },
      { key: 'creationTime', title: '创建时间' },
      { key: 'lastChangeBy', title: '修改人' },
      { key: 'lastChangeTime', title: '修改时间' }
    ]
    let extra: any[] = []
    if (this.dir) {
      extra = [
        { key: 'limitSize', title: '容量', filter: 'size:不限' },
        { key: 'limitSuffix', title: '文件后缀' }
      ]
    } else {
      extra = [
        { key: 'size', title: '大小', filter: 'size' }
      ]
    }
    ret.push(...extra)
    return ret
  }

  resolveText (row: any) {
    if (row.filter) {
      const [f, rest] = row.filter.split(':')
      const args = (rest || '').split(':')
      return filters[f](this.file[row.key], ...args)
    } else {
      return this.file[row.key]
    }
  }

  get iconProps () {
    let dir = this.file.dir
    let personal = this.file.personal
    let root = false
    let contentType = this.file.contentType
    return { dir, personal, root, contentType }
  }
}
</script>

<style lang="scss" module>
.container {

}

.item {
  line-height: 32px;
}
</style>
