<template>
    <div>
        <div :class="[$style.toolbar]" class="m-2">
            <span class="d-flex">
                <v-dropdown class="d-inline-block" trigger="hover">
                  <v-button color="primary" class="mr-2" icon="upload" @click="onUpload(true, false)">上传</v-button>
                  <v-dropdown-menu slot="dropdown">
                    <v-dropdown-item @click.native="onUpload(true, false)">上传文件</v-dropdown-item>
                    <v-dropdown-item @click.native="onUpload(true, true)">上传文件夹</v-dropdown-item>
                  </v-dropdown-menu>
                </v-dropdown>
                <v-button color="primary" class="mr-2" @click="onNew">新建文件夹</v-button>

                <v-button-group class="mr-2">
                    <v-button color="primary" @click="row.action()" v-for="(row, i) in renderedActions" :key="i">{{row.title}}</v-button>
                    <!-- <v-button color="primary" @click="onRenew()">更新</v-button>
                    <v-button color="primary" @click="onFileRecord()">版本</v-button>
                    <v-button color="primary" @click="onShare()">分享</v-button>
                    <v-button color="primary" @click="onDownload()">下载</v-button>
                    <v-button color="primary" @click="onDelete()">删除</v-button>
                    <v-button color="primary" @click="onRename()">重命名</v-button>
                    <v-button color="primary" @click="onCopyTo()">复制到</v-button>
                    <v-button color="primary" @click="onMoveTo()">移动到</v-button>
                    <v-button color="primary" @click="onCollect()">收藏</v-button> -->
                </v-button-group>
            </span>

            <span class="mr-2 ft-24 d-flex">
                <span v-if="view === 'list'" class="icon-btn" @click="onSelectView('thumbnail')"><v-icon type="appstore"></v-icon></span>
                <span v-if="view === 'thumbnail'" class="icon-btn" @click="onSelectView('list')"><v-icon type="bars"></v-icon></span>
            </span>
        </div>

        <div class="d-flex justify-content-between align-content-center m-2">
            <file-navigator :id="parentId"></file-navigator>
            <v-alert type="info" style="flex: 0 0 auto;" class="ml-5 w-14">
                <template slot="description">
                    已选择 <span>{{checkedRows.length}}</span> 项
                    <a class="ml-2" @click="onClearSelection">清空选择</a>
                </template>
            </v-alert>
        </div>

        <div>
            <file-list :data-source="dataSource" :checked-rows.sync="checkedRows" v-if="view === 'list'"></file-list>
            <file-thumbnail :data-source="dataSource" :checked-rows.sync="checkedRows" v-else></file-thumbnail>
        </div>

        <edit-dir ref="editDir"></edit-dir>
        <file-upload ref="fileUpload"></file-upload>
        <file-link ref="fileLink"></file-link>
        <file-rename ref="fileRename"></file-rename>
        <file-preview ref="filePreview"></file-preview>
        <file-record ref="fileRecord"></file-record>
        <file-chooser ref="fileChooser"></file-chooser>
        <file-collect ref="fileCollect"></file-collect>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch, Provide, Inject } from 'vue-property-decorator'
import { queryFiles, downloadFile, deleteFiles, moveFiles, copyFiles } from '@/api/file'
import { download } from '@/helpers/download'
import FileList from './file-list/index.vue'
import FileThumbnail from './file-thumbnail/index.vue'
import FileNavigator from './file-navigator/index.vue'
import EditDir from './edit-dir/index.vue'
import FileUpload from './file-upload/index.vue'
import FileLink from './file-link/index.vue'
import FileRename from './file-rename/index.vue'
import FileRecord from './file-record/index.vue'
import FileCollect from './file-collect/index.vue'
import { UMASK, hasAllAuthority } from '@/common/umask'

@Component({
  components: { FileList, FileThumbnail, FileNavigator, EditDir, FileUpload, FileLink, FileRename, FileRecord, FileCollect }
})
export default class FileResult extends Vue {
    @Prop(Number) parentId!: number

    view: 'list' | 'thumbnail' = 'list'

    checkedRows: any = []

    dataSource: any[] = []

    loading: boolean = false

    actions = [
      { title: '打开', batch: false, umask: UMASK.PREVIW.value, action: this.onPreview },
      { title: '更新', batch: false, umask: UMASK.UPDATE_FILE.value, action: this.onRenew },
      { title: '详情', batch: false, umask: UMASK.ACCESS.value, action: this.onRenew },
      { title: '版本', batch: false, umask: UMASK.ACCESS.value, action: this.onFileRecord },
      { title: '分享', batch: true, umask: UMASK.LINK.value, action: this.onShare },
      { title: '下载', batch: false, umask: UMASK.DOWNLOAD.value, action: this.onDownload },
      { title: '删除', batch: true, umask: UMASK.RECYCLE.value, action: this.onDelete },
      { title: '重命名', batch: false, umask: UMASK.RENAME.value, action: this.onRename },
      { title: '复制到', batch: true, umask: UMASK.DOWNLOAD.value, action: this.onCopyTo },
      { title: '移动到', batch: true, umask: UMASK.RECYCLE.value | UMASK.DOWNLOAD.value, action: this.onMoveTo },
      { title: '收藏', batch: false, umask: UMASK.ACCESS.value, action: this.onCollect }
    ]

    @Inject() reload!: (id?: number) => void

    get filter () {
      return this.$route.query.filter || null
    }

    get renderedActions () {
      return this.filterActions()
    }

    @Provide() filterActions (row?: any) {
      const rows = row ? [row] : this.checkedRows
      if (rows.length < 1) return []
      return this.actions.filter((v: any) => {
        if (!v.batch && rows.length > 1) return false
        return true
      }).filter((v: any) => {
        return rows.every((w: any) => {
          return hasAllAuthority(w.umask, v.umask)
        })
      })
    }

    onSelectView (view: 'list' | 'thumbnail') {
      this.view = view
    }

    onClearSelection () {
      this.checkedRows = []
    }

    @Provide() onPreview (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('只能选择一条记录')
        return
      }
      let row = file || this.checkedRows[0]
      if (row.dir) {
        this.$router.push({ path: '/file', query: { id: row.id } })
      } else {
        const $e = this.$refs.filePreview as any
        $e.preview(row, this.dataSource)
      }
    }

    onUpload (multiple: boolean, directory: boolean) {
      const $e = this.$refs.fileUpload as FileUpload
      $e.upload(this.parentId, multiple, directory).then(() => {
        this.$message.success('上传成功')
        this.refresh()
      })
    }

    onNew () {
      const $e = this.$refs.editDir as EditDir
      $e.add(this.parentId).then(() => {
        this.$message.success('新建文件夹成功')
        this.reload()
        this.refresh()
      })
    }

    @Provide() onShare (file?: any) {
      let files = file ? [file] : this.checkedRows
      if (files.length < 1) {
        this.$message.info('请选择分享文件')
        return
      }
      const $e = this.$refs.fileLink as FileLink
      $e.share(files).then(() => {
        // do nothing
      })
    }

    @Provide() onDownload (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('暂不支持批量下载')
        return
      }
      let row = file || this.checkedRows[0]
      // if (row.dir) {
      //   this.$message.info('暂不支持下载文件夹')
      //   return
      // }
      downloadFile(row.id).then(data => {
        download(data, row.name)
      })
    }

    @Provide() onDelete (file?: any) {
      if (!this.validate(file)) return
      this.$modal.confirm({ title: '确认', content: '确认删除文件？' }).then(() => {
        let ids: number[] = file ? [file.id] : this.checkedRows.map((v: any) => v.id)
        deleteFiles(ids).then((data) => {
          this.$message.success('文件删除成功')
          this.reload()
          this.refresh()
        })
      })
    }

    @Provide() onRename (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('只能选择一条记录')
        return
      }
      let row = file || this.checkedRows[0]
      let $e = this.$refs.fileRename as any
      $e.rename(row).then(() => {
        this.$message.success('重命名成功')
        if (row.dir) {
          this.reload()
        }
        this.refresh()
      })
    }

    @Provide() onRenew (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('不能选择多条记录')
        return
      }
      let f = file || this.checkedRows[0]
      const $e = this.$refs.fileUpload as FileUpload
      $e.update(f.id).then(() => {
        this.$message.success('更新成功')
        this.refresh()
      })
    }

    @Provide() onFileRecord (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('不能选择多条记录')
        return
      }
      let f = file || this.checkedRows[0]
      const $e = this.$refs.fileRecord as FileRecord
      $e.view(f.id).then(() => {
        // do nothing
      })
    }

    @Provide() onCopyTo (file?: any) {
      if (!this.validate(file)) return
      let files = file ? [file] : this.checkedRows
      let sources = files.map((v: any) => v.id)
      const $e = (this.$refs as any).fileChooser as any
      $e.choose(true, '复制到').then((target: any) => {
        copyFiles({ sources, target }).then((data) => {
          this.$message.success(`成功复制${data}个文件`)
          this.reload()
          this.reload(target)
          this.refresh()
        })
      })
    }

    @Provide() onMoveTo (file?: any) {
      if (!this.validate(file)) return
      let files = file ? [file] : this.checkedRows
      let sources = files.map((v: any) => v.id)
      const $e = (this.$refs as any).fileChooser as any
      $e.choose(true, '移动到').then((target: any) => {
        moveFiles({ sources, target }).then((data) => {
          this.$message.success(`成功移动${data}个文件`)
          this.reload()
          this.reload(target)
          this.refresh()
        })
      })
    }

    @Provide() onCollect (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('只能选择一条')
      }
      let f = file || this.checkedRows[0]
      const $e = this.$refs.fileCollect as FileCollect
      $e.collect(f.id, f.name).then(() => {
        this.$message.success('收藏成功')
        this.refresh()
      })
    }

    disabled (type: 'share' | 'download' | 'delete' | 'rename', file?: any) {
      // TODO
    }

    refresh () {
      this.loadData()
      this.onClearSelection()
    }

    loadData () {
      if (!this.parentId) {
        this.dataSource = []
        return
      }
      let parentId = this.parentId
      let req = { parentId }
      this.loading = true
      queryFiles(req).then(data => {
        this.dataSource = (data || []).filter(v => {
          if (!this.filter) return true
          const list = (this.filter as any).split(',').map((v: any) => +v)
          return list.includes(v.id)
        })
      }).finally(() => {
        this.loading = false
      })
    }

    validate (file?: any) {
      if (!file && this.checkedRows.length < 1) {
        this.$message.info('请选择文件')
        return false
      }
      return true
    }

    @Watch('parentId', { immediate: true }) parentIdChange (parentId: number) {
      this.refresh()
    }
}
</script>

<style lang="scss" module>
.toolbar {
    display: flex;
    justify-content: space-between;
}
</style>
