<template>
<div class="mx-3">
  <ul :class="[$style.list]" v-loading="loading">
    <li :class="[$style.item, activeCls(row)]" v-for="(row, i) in dataSource" :key="i" @click="onPreview(row)">
      <v-dropdown trigger="contextMenu" :class="[$style.dropdown]">
        <div :class="[$style.box]" @contextmenu="onRowMenu(row)">
          <div :class="[$style.icon]">
            <img :src="imageUrl(row)" :class="[$style.thumbnail]" v-if="imageUrl(row)">
            <file-icon v-bind="iconProps(row)" class="ft-64" v-else></file-icon>
          </div>
          <div class="text-truncate text-center px-3" :title="row.name">{{row.name}}</div>
          <div :class="[$style.checkbox]"><v-icon type="check-circle"></v-icon></div>
        </div>
        <v-dropdown-menu slot="dropdown">
          <v-dropdown-item @click.native="onPreview(row)" :class="[$style.menu]">预览</v-dropdown-item>
          <v-dropdown-item @click.native="onDownload(row)" :class="[$style.menu]">下载</v-dropdown-item>
        </v-dropdown-menu>
      </v-dropdown>
    </li>
  </ul>
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
import { getType } from '@/common/content-type'

const baseUrl = process.env.VUE_APP_API_BASE_URL

@Component
export default class Display extends Vue {
  api = searchFiles

  form = {
    keyUnit: '',
    name: '',
    creationBy: '',
    creationTimeStart: '',
    creationTimeEnd: '',
    leader: '',
    location: '',
    unit: '',
    tags: ''
  }

  loading: boolean = false

  dataSource: any[] = []

  checkedRows: any[] = []

  get keyUnit () {
    return this.$route.query.zddw as any
  }

  onPreview (row: any) {
    const $e = this.$refs.filePreview as any
    $e.preview(row, this.dataSource)
  }

  onDownload (row: any) {
    let file = row.file
    downloadFile(row.id).then(data => {
      download(data, row.dir ? `${row.name}.zip` : row.name)
    })
  }

  get menus () {
    return []
  }

  iconProps (row: any) {
    let dir = row.dir
    let personal = row.personal
    let root = false
    let contentType = row.contentType
    return { dir, personal, root, contentType }
  }

  activeCls (row: any) {
    return this.checkedRows.includes(row) ? (this as any).$style.active : ''
  }

  imageUrl (row: any) {
    if (getType(row.contentType) !== 'image') return ''
    return `${baseUrl}/files/${row.id}/preview`
  }

  onCheck (row: any) {
    let copy = this.checkedRows.slice()
    let idx = copy.findIndex((v: any) => v === row)
    if (idx !== -1) {
      copy.splice(idx, 1)
    } else {
      copy.push(row)
    }
    this.checkedRows = copy
  }

  onRowMenu (row: any) {
    if (this.checkedRows.some(v => v === row)) return
    this.checkedRows = [row]
  }

  // onBatchDownload () {
  //   const ret = this.checkedRows.filter((v: any) => {
  //     return this.canDownload(v)
  //   })
  //   if (ret.length < 1) {
  //     this.$message.info('无可下载文件')
  //     return
  //   }
  //   this.$modal.confirm({
  //     title: '下载确认',
  //     content: `共 ${ret.length} 个可下载文件, 确认下载?`
  //   }).then(() => {
  //     ret.forEach((v: any) => {
  //       this.onDownload(v)
  //     })
  //   }).catch(() => {
  //     // ignore
  //   })
  // }

  loadData () {
    this.loading = true
    const params = {
      ...this.form,
      page: 0,
      size: 1000
    }
    searchFiles(params).then(data => {
      this.dataSource = (data && data.content) || []
    }).finally(() => {
      this.loading = false
    })
  }

  mounted () {
    this.form.keyUnit = this.keyUnit || ''
    this.loadData()
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
.list{
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  width: 0;
  min-width: 100%;
  flex-wrap: wrap;
  max-height: calc(100vh - 64px - 40px - 36px - 8px);
  overflow: auto;
}

.item {
    width: 240px;
    height: 220px;
    margin: 4px 0 0 6px;
    border-radius: 4px;
    position: relative;
    border: 1px solid transparent;
    &:hover {
      background-color: var(--primary-lighten-5);
      transition: background-color .35s ease;
          // & .checkbox {
          //   visibility: visible;
          // }
    }
    &.active {
        background-color: var(--primary-lighten-5);
        border-color: var(--primary-base);
        & .checkbox {
          visibility: visible;
          color: var(--primary-base);
        }
    }
}

.dropdown {
  :global {
    .v-dropdown__popper {
      display: block;
    }
  }
}

.box {
  width: 100%;
}

.icon {
  text-align: center;
  height: 180px;
}

.checkbox {
    position: absolute;
    left: 4px;
    top: 4px;
    color: var(--primary-lighten-3);
    visibility: hidden;

    &:hover {
      color: var(--primary-lighten-2);
      cursor: pointer;
    }
}

.menu {
  width: 120px;
  padding-left: 32px;
}

.thumbnail {
    max-width: 100%;
    max-height: 180px;
    padding: 4px;
    border-radius: 4px;
}
</style>
