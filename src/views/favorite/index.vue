<template>
<div :class="[$style.container]">
  <div :class="[$style.sider]">
    <div :class="[$style.header]"><span class="text-heading">收藏分类</span><a class="ml-3" @click="editting = true"><v-icon type="plus-circle-o"></v-icon></a></div>
    <div class="d-flex align-items-center mt-2" v-if="editting">
      <v-input v-model.trim="form.name" placeholder="请填写名称" size="sm" class="w-8"></v-input>
      <a class="ml-2" @click="onSave">保存</a>
      <a class="ml-2" @click="onCancel">取消</a>
    </div>
    <ul :class="[$style.list]" class="mt-2">
      <li :class="[$style.item, activeCls(item)]" v-for="(item, i) in catalogs" :key="i" @click="onSelect(item)">
        <span>{{item.name}}</span>
        <div :class="[$style.action]">
          <span class="icon-btn" @click.stop="onRemove(item)"><v-icon type="close-circle-o"></v-icon></span>
        </div>
      </li>
    </ul>
  </div>
  <div :class="[$style.content]">
    <div :class="[$style.header]" class="mb-2">收藏名称</div>
    <ul :class="[$style.ul]" v-if="items.length > 0">
      <li :class="[$style.li]" v-for="(row, i) in items" :key="i">
        <div><a @click="onForward(row)">{{row.name}}</a></div>
        <div class="mx-4"><span class="caption">{{row.remark}}</span></div>
        <div><span class="icon-btn mr-3" @click="onDelete(row)"><v-icon type="delete"></v-icon></span></div>
      </li>
    </ul>
    <no-data v-else></no-data>
  </div>
</div>
</template>

<script lang="ts">

import { Vue, Component, Watch } from 'vue-property-decorator'

import { queryCatalogs, addCatalog, deleteCatalog, queryItems, deleteItem } from '@/api/favorite'
import { getFile } from '@/api/file'

@Component
export default class Favorite extends Vue {
  catalogs: any[] = []

  items: any[] = []

  form = {
    name: ''
  }

  editting: boolean = false

  current: any = null

  onSave () {
    const req = { name: this.form.name }
    if (!req.name) {
      this.$message.warning('请输入名称')
      return
    }
    addCatalog(req).then(data => {
      this.loadCatalogs()
      this.form.name = ''
      this.editting = false
    })
  }

  onCancel () {
    this.form.name = ''
    this.editting = false
  }

  onSelect (row: any) {
    if (row.id !== this.current) {
      this.current = row.id
    }
  }

  onRemove (row: any) {
    deleteCatalog(row.id).then(data => {
      this.loadCatalogs()
    })
  }

  onForward (row: any) {
    getFile(row.fileId).then(data => {
      if (!data || !data.status) {
        this.$message.error('文件已不存在')
        return
      }
      this.$router.push(`/file?id=${row.fileParentId}&filter=${row.fileId}`)
    })
  }

  onDelete (row: any) {
    deleteItem(row.id).then(data => {
      this.$message.success('删除成功')
      this.loadItems()
    })
  }

  loadCatalogs () {
    queryCatalogs().then(data => {
      this.catalogs = data || []
      if (!this.current && this.catalogs[0]) {
        this.current = this.catalogs[0].id
      }
    })
  }

  loadItems () {
    if (!this.current) {
      this.items = []
      return
    }
    queryItems(this.current).then(data => {
      this.items = data || []
    })
  }

  activeCls (row: any) {
    if (row.id === this.current) {
      return (this as any).$style.activeItem
    }
    return ''
  }

  @Watch('current') currentChange (current: any) {
    this.loadItems()
  }

  mounted () {
    this.loadCatalogs()
  }
}
</script>

<style lang="scss" module>
.container{
  display: flex;
}

.sider{
  width: 320px;
  border-right: 1px solid var(--border-color-split);
  height: calc(100vh - 160px);
  overflow: auto;
}

.header {
  line-height: 36px;
  background-color: var(--bg-color-2);
  padding: 0 8px;
}

.content{
  width: calc(100% - 320px);
}

.list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.item {
  margin: 4px 0;
  height: 24px;
  line-height: 24px;
  padding-left: 8px;
  position: relative;
  cursor: pointer;

  &>.action {
      display: none;
  }

  &:hover {
    background-color: var(--bg-color-2);
    &>.action {
      display: block;
    }
  }
}

.activeItem {
  background-color: var(--bg-color-active) !important;
}

.action {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

.ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.li {
  min-height: 42px;
  border-bottom: 1px solid var(--border-color-split);
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;

  &:hover {
    background-color: var(--bg-color-2);
  }
}
</style>
