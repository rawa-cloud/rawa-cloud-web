<template>
<div class="mx-3">
  <v-list :data-source="dataSource" bordered>
    <v-list-item slot-scope="{item}">
      <v-list-item-meta slot="meta" :title="item.name">
        <v-avatar type="image" slot="avatar">
          <img :src="src(item)" alt="&times;">
        </v-avatar>
        <p slot="description">{{item.status | transcode('status')}}</p>
      </v-list-item-meta>
      <div class="text-center">
        <pre>{{item.content}}</pre>
      </div>
      <div slot="action">
        <a class="text-secondary" @click="onEdit(item)"><i class="anticon anticon-edit"></i></a>
        <span class="mx-3 text-disabled">|</span>
        <a class="text-secondary" @click="onDelete(item)"><i class="anticon anticon-delete"></i></a>
      </div>
    </v-list-item>
  </v-list>

  <v-button type="dashed" block class="mt-3" icon="plus" color="primary" @click="onAdd"></v-button>

  <edit ref="edit"></edit>
</div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Edit from './edit/index.vue'
import { query, del } from '@/api/watermark'

const baseUrl = process.env.VUE_APP_API_BASE_URL

@Component({
  components: { Edit }
})
export default class List extends Vue {
  dataSource: any[] = []

  onAdd () {
    (this.$refs.edit as any).add().then(() => {
      this.$message.success('新增水印成功')
      this.loadData()
    }).catch(() => {
      // ignore
    })
  }

  onEdit (row: any) {
    (this.$refs.edit as any).edit(row).then(() => {
      this.$message.success('更新水印成功')
      this.loadData()
    }).catch(() => {
      // ignore
    })
  }

  onDelete (row: any) {
    this.$modal.confirm({ title: '确认', content: '确认删除水印？' }).then(() => {
      return del(row.id).then(() => {
        this.$message.success('删除水印成功')
        this.loadData()
      })
    }).catch(() => {
      // ignore
    })
  }

  src (row: any) {
    return baseUrl + '/nas/download/' + row.uuid
  }

  loadData () {
    query().then(data => {
      this.dataSource = data || []
    })
  }

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
</style>
