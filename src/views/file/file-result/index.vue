<template>
    <div :class="[$style.container]">
        <div :class="[$style.toolbar]">
            <span class="d-flex">
                <v-dropdown trigger="click" class="d-inline-block mr-2">
                  <v-button type="primary" :size="size" :disabled="!canUpload" icon="upload"> 上 传 </v-button>
                  <v-dropdown-menu slot="dropdown">
                    <v-dropdown-item @click.native="onUpload(true, false)">上传文件</v-dropdown-item>
                    <v-dropdown-item @click.native="onUpload(true, true)">上传文件夹</v-dropdown-item>
                  </v-dropdown-menu>
                </v-dropdown>
                <v-button :size="size" color="primary" class="mr-2" icon="plus" @click="onNew" :disabled="!canMkDir">新建文件夹</v-button>

                <v-button-group class="mr-2">
                  <v-button :size="size" color="primary" @click="row.action()" v-for="(row, i) in renderedFirstActions" :key="i">{{row.title}}</v-button>
                  <v-dropdown trigger="click" v-if="renderedSecondActions.length > 0">
                    <v-button :size="size" color="primary" :class="[$style.more]" icon="ellipsis">更多</v-button>
                    <v-dropdown-menu slot="dropdown">
                      <v-dropdown-item @click.native="row.action()" v-for="(row, i) in renderedSecondActions" :key="i">
                        <span class="mx-3">{{row.title}}</span>
                      </v-dropdown-item>
                    </v-dropdown-menu>
                  </v-dropdown>
                </v-button-group>
            </span>

            <span class="mr-2 ft-24 d-flex">
                <v-dropdown trigger="click" class="d-inline-block mr-2">
                  <span class="icon-btn"><svg-icon icon="sort"></svg-icon></span>
                  <v-dropdown-menu slot="dropdown">
                    <v-dropdown-item @click.native="onSort('dir')">文件类型</v-dropdown-item>
                  </v-dropdown-menu>
                </v-dropdown>
                <span v-if="view === 'list'" class="icon-btn" @click="onSelectView('thumbnail')"><svg-icon icon="flat"></svg-icon></span>
                <span v-if="view === 'thumbnail'" class="icon-btn" @click="onSelectView('list')"><svg-icon icon="list"></svg-icon></span>
            </span>
        </div>

        <div :class="[$style.navbar]">
            <file-navigator :id="parentId"></file-navigator>
            <span> 已选择 <span>{{checkedRows.length}}</span> 项 <a class="ml-2" @click="onClearSelection">清空选择</a></span>
        </div>

        <div v-loading="loading">
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
        <file-detail ref="fileDetail"></file-detail>
        <file-edit ref="fileEdit"></file-edit>
        <img-size-chooser ref="imgSizeChooser"></img-size-chooser>
        <choose-file-info ref="chooseFileInfo"></choose-file-info>
        <add-tag ref="addTag"></add-tag>
        <edit-file-info ref="editFileInfo"></edit-file-info>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch, Provide, Inject } from 'vue-property-decorator'
import { queryFiles, downloadFile, downloadImageFile, deleteFiles, moveFiles, copyFiles, getFile, updateTags } from '@/api/file'
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
import FileDetail from './file-detail/index.vue'
import FileEdit from './file-edit/index.vue'
import ChooseFileInfo from './choose-file-info/index.vue'
import ImgSizeChooser from './img-size-chooser/index.vue'
import AddTag from './add-tag/index.vue'
import EditFileInfo from './edit-file-info/index.vue'
import { UMASK, hasAllAuthority, hasAnyAuthority } from '@/common/umask'
import { getType, isImage } from '@/common/content-type'
import { http } from '@/api'

@Component({
  components: { FileList,
    FileThumbnail,
    FileNavigator,
    EditDir,
    FileUpload,
    FileLink,
    FileRename,
    FileRecord,
    FileCollect,
    FileDetail,
    FileEdit,
    ImgSizeChooser,
    ChooseFileInfo,
    AddTag,
    EditFileInfo
  }
})
export default class FileResult extends Vue {
    @Prop(Number) parentId!: number

    size: string = 'md'

    view: 'list' | 'thumbnail' = 'list'

    checkedRows: any = []

    dataSource: any[] = []

    loading: boolean = false

    parent: any = null

    sort = {
      prop: 'dir',
      asc: true
    }

    properties: any = []

    actions = [
      { title: '预览', batch: false, umask: UMASK.PREVIW.value, action: this.onPreview },
      { title: '下载', batch: true, umask: UMASK.DOWNLOAD.value, action: this.onDownload },
      { title: '更新', batch: false, onlyFile: true, umask: UMASK.UPDATE_FILE.value, action: this.onRenew },
      // { title: '编辑', batch: false, onlyFile: true, umask: UMASK.UPDATE_FILE.value, onlyOffice: true, action: this.onOnlineEdit },
      // { title: '版本', batch: false, onlyFile: true, umask: UMASK.ACCESS.value, action: this.onFileRecord },
      // { title: '分享', batch: true, umask: UMASK.LINK.value, action: this.onShare },
      { title: '编辑', batch: false, onlyDir: true, umask: UMASK.RENAME.value, action: this.onUpdateDir },
      { title: '编辑信息', batch: false, onlyFile: true, umask: UMASK.RENAME.value, action: this.onUpdateInfo },
      { title: '重命名', batch: false, umask: UMASK.RENAME.value, action: this.onRename },
      { title: '删除', batch: true, umask: UMASK.RECYCLE.value, action: this.onDelete },
      { title: '复制到', batch: true, umask: UMASK.DOWNLOAD.value, action: this.onCopyTo },
      { title: '移动到', batch: true, umask: UMASK.RECYCLE.value | UMASK.DOWNLOAD.value, action: this.onMoveTo },
      // { title: '收藏', batch: false, umask: UMASK.ACCESS.value, action: this.onCollect },
      { title: '详情', batch: false, umask: UMASK.ACCESS.value, action: this.onDetail }
      // { title: '权限', batch: false, admin: true, action: this.onGoAuthority }
    ]

    @Inject() reload!: (id?: number) => void

    get filter () {
      return this.$route.query.filter || null
    }

    get renderedActions () {
      return this.filterActions()
    }

    get renderedFirstActions () {
      return this.renderedActions.slice(0, 5)
    }

    get renderedSecondActions () {
      return this.renderedActions.slice(5)
    }

    get canUpload () {
      const umask = (this.parent && this.parent.umask) || 0
      return hasAllAuthority(umask, UMASK.NEW_FILE.value)
    }

    get canMkDir () {
      const umask = (this.parent && this.parent.umask) || 0
      return hasAllAuthority(umask, UMASK.MK_DIR.value)
    }

    get imageDownloadSizeEnabled () {
      return this.properties.some((v: any) => v.name === 'image.download.size.enabled' && v.value === 'Y')
    }

    @Provide() filterActions (row?: any) {
      const rows = row ? [row] : this.checkedRows
      if (rows.length < 1) return []
      return this.actions.filter((v: any) => {
        if (!v.batch && rows.length > 1) return false
        if (v.onlyFile && rows.some((w: any) => w.dir)) return false
        if (v.onlyDir && rows.some((w: any) => !w.dir)) return false
        if (v.onlyOffice) return rows.every((w: any) => getType(w.contentType) === 'office')
        return true
      })
      // .filter((v: any) => {
      //   if (v.admin) {
      //     return rows.every((w: any) => w.admin && !w.userId)
      //   }
      //   return rows.every((w: any) => {
      //     return hasAllAuthority(w.umask, v.umask)
      //   })
      // })
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
        if (!hasAnyAuthority(row.umask, UMASK.PREVIW.value)) {
          this.$message.info(`没有该文件的预览权限`)
          return
        }
        const $e = this.$refs.filePreview as any
        $e.preview(row, this.dataSource)
      }
    }

    @Provide() onUpdateInfo (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('只能选择一条记录')
        return
      }
      let row = file || this.checkedRows[0]
      const $e = this.$refs.editFileInfo as EditFileInfo
      $e.edit(row).then((data: any) => {
        this.$message.success('更新成功')
        Object.assign(row, data || {})
      })
    }

    onUpload (multiple: boolean, directory: boolean) {
      const $e = this.$refs.fileUpload as FileUpload
      const $c = this.$refs.chooseFileInfo as ChooseFileInfo
      $c.choose().then((data: any) => {
        $e.upload(this.parentId, multiple, directory, data).then(() => {
          this.$message.success('上传成功')
          this.refresh()
          if (directory) this.reload()
        })
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

    onUpdateDir (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('只能选择一条记录')
        return
      }
      let row = file || this.checkedRows[0]
      const $e = this.$refs.editDir as EditDir
      $e.edit(row).then(() => {
        this.$message.success('编辑文件夹成功')
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
      // if (!this.validate(file)) return
      // if (!file && this.checkedRows.length > 1) {
      //   this.$message.info('暂不支持批量下载')
      //   return
      // }
      // let row = file || this.checkedRows[0]
      // if (row.dir) {
      //   this.$message.info('暂不支持下载文件夹')
      //   return
      // }
      let files = file ? [file] : this.checkedRows
      if (files.length < 1) {
        this.$message.info('请选择下载文件')
        return
      }
      let useImageDownload = false
      if (this.imageDownloadSizeEnabled) {
        const allImage = files.every((v: any) => {
          return !v.dir && isImage(v.contentType)
        })
        if (allImage) useImageDownload = true
      }
      if (useImageDownload) {
        const $e = this.$refs.imgSizeChooser as ImgSizeChooser
        $e.choose().then(data => {
          const { height, width } = data
          files.forEach((v: any) => {
            downloadImageFile(v.id, height, width).then(data => {
              download(data, v.dir ? `${v.name}.zip` : v.name)
            })
          })
        })
      } else {
        files.forEach((v: any) => {
          downloadFile(v.id).then(data => {
            download(data, v.dir ? `${v.name}.zip` : v.name)
          })
        })
      }
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
      $e.update(f.id, f.name).then(() => {
        this.$message.success('更新成功')
        this.refresh()
      })
    }

    @Provide() onOnlineEdit (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('不能选择多条记录')
        return
      }
      let f = file || this.checkedRows[0]
      const $e = this.$refs.fileEdit as FileEdit
      $e.edit(f)
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

    @Provide() onGoAuthority (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('只能选择一条')
      }
      let f = file || this.checkedRows[0]
      this.$router.push(`/authority?fileId=${f.id}&t=${Date.now()}`)
    }

    @Provide() onDetail (file?: any) {
      if (!this.validate(file)) return
      if (!file && this.checkedRows.length > 1) {
        this.$message.info('只能选择一条')
      }
      let f = file || this.checkedRows[0]
      const $e = this.$refs.fileDetail as FileDetail
      $e.view(f).then(() => {})
    }

    @Provide() onAddTag (row?: any) {
      const $e = this.$refs.addTag as AddTag
      $e.add().then((data: any) => {
        const origin = row._tags || []
        const req = [...origin, data]
        updateTags(row.id, req).then(() => {
          row._tags = req
        })
      })
    }

    @Provide() onRemoveTag (row: any, idx: number) {
      const $e = this.$refs.addTag as AddTag
      const origin = row._tags || []
      const req = origin.filter((v: any, i: number) => idx !== i)
      updateTags(row.id, req).then(() => {
        row._tags = req
      })
    }

    onSort (prop: string) {
      if (this.sort.prop === prop) {
        this.sort.asc = !this.sort.asc
      } else {
        this.sort.prop = prop
        this.sort.asc = true
      }

      this.dataSource = this.dataSource.sort((a: any, b: any) => {
        const x = a[this.sort.prop]
        const y = a[this.sort.prop]
        return (this.sort.asc ? a > b : a < b) ? 1 : -1
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
        this.dataSource = (data || []).filter((v: any) => {
          v._tags = tags(v.tags)
          if (!this.filter) return true
          const list = (this.filter as any).split(',').map((v: any) => +v)
          return list.includes(v.id)
        })
      }).finally(() => {
        this.loading = false
      })

      function tags (t: string) {
        if (!t) return []
        try {
          const ret = JSON.parse(t)
          if (!Array.isArray(ret)) return []
          return ret
        } catch (error) {
          return []
        }
      }
    }

    loadProperties () {
      http().get('/properties').then(data => {
        this.properties = data || []
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
      if (parentId) {
        getFile(parentId).then(data => {
          this.parent = data || null
        })
      } else {
        this.parent = null
      }
    }

    created () {
      this.loadProperties()
    }
}
</script>

<style lang="scss" module>
.container {
  padding: 0 12px;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 4px;
  font-size: 12px;
}

.more {
  margin-left: -1px;
  border-radius: 0 4px 4px 0;
}
</style>
