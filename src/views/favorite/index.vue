<template>
<div :class="[$style.container]">
  <div :class="[$style.sider]">
    <div><span class="text-heading">收藏分类</span><a class="ml-3" @click="editting = true"><v-icon type="plus-circle-o"></v-icon></a></div>
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
  <div :class="[$style.content]" class="pl-3">
    <v-list :data-source="items" :bordered="false" size="sm" v-if="items.length > 0">
      <v-list-item slot-scope="{item}">
        <v-list-item-meta slot="meta"
          :description="item.remark">
          <a slot="title" @click="onForward(item)">{{item.name}}</a>
        </v-list-item-meta>
      </v-list-item>
    </v-list>
    <no-data v-else></no-data>
  </div>
</div>
</template>

<script lang="ts">

import { Vue, Component, Watch } from 'vue-property-decorator'

import { queryCatalogs, addCatalog, deleteCatalog, queryItems } from '@/api/favorite'

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
    this.$router.push(`/file?id=${row.fileParentId}&filter=${row.fileId}`)
  }

  loadCatalogs () {
    queryCatalogs().then(data => {
      this.catalogs = data || []
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
  padding: 8px 12px;
}

.sider{
  width: 200px;
}

.content{
  width: calc(100% - 200px);
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
</style>
