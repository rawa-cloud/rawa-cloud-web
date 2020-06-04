<template>
    <div>
      <v-modal :visible.sync="actualVisible" width="40vw" :title="title" :maskClosable="false" :keyboard="false">
        <div :class="[$style.body]">
          <div :class="[$style.upload]">
            <v-upload :custom-request="customRequest" :before-upload="beforeUpload"
              :multiple="multiple" :directory="directory" :file-list.sync="fileList"
              :success-fn="successFn" :remove-fn="removeFn" v-if="visible">
              <div class="border rounded border-dashed w-16 h-12 text-center p-4">
                <div class="text-primary ft-64"><v-icon type="upload"></v-icon></div>
                <div class="display-5">点击或拖动文件到此处</div>
              </div>
            </v-upload>
          </div>

          <div v-if="isUpdate">
            <v-textarea v-model.trim="form.remark" maxlength="100"></v-textarea>
          </div>
        </div>
        <div slot="footer" class="text-right">
          <v-button @click="onCancel">取消</v-button>
          <v-button type="primary" class="ml-3" @click="onConfirm">确定</v-button>
        </div>
      </v-modal>
    </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import request from './request'
import { remove } from '@/api/nas'
import { addFile, batchAddFile, updateFileContent } from '@/api/file'
import { UploadFile } from 'vua'

@Component
export default class FileUpload extends Vue {
  id: number | null = null

  multiple: boolean = true

  directory: boolean = false

  isUpdate: boolean = false

  title: string = ''

  name: string = ''

  form = {
    remark: ''
  }

  fileList: any[] = []

  resolve: Function | null = null

  reject: Function | null = null

  visible: boolean = false

  customRequest = request

  get actualVisible () {
    return this.visible
  }

  set actualVisible (visible: boolean) {
    this.onCancel()
  }

  get uploading (): boolean {
    return this.fileList.some((v: any) => !v.url)
  }

  beforeUpload (file: UploadFile, fileList: UploadFile[]): boolean {
    if (!this.isUpdate) return true
    if (fileList.length < 2) return true

    this.$message.info('请先移除存在文件')
    fileList.pop()
    return false
  }

  successFn (data: any, file: UploadFile) {
    file.url = data
  }

  removeFn () {
    return Promise.resolve()
  }

  upload (parentId: number, multiple: boolean = true, directory: boolean = false) {
    this.isUpdate = false
    this.multiple = multiple
    this.directory = directory
    this.id = parentId
    this.name = ''
    this.title = this.directory ? '上传文件夹' : '上传文件'
    return this.init()
  }

  update (id: number, name: string) {
    this.isUpdate = true
    this.multiple = false
    this.directory = false
    this.id = id
    this.title = '更新文件'
    this.name = name
    return this.init()
  }

  init (): Promise<any> {
    this.form = {
      remark: ''
    }
    this.fileList = []
    this.visible = true
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  onCancel () {
    if (this.uploading) {
      this.$modal.confirm({ title: '确认', content: '正在上传文件， 是否要中断?' }).then(() => {
        this.visible = false
        if (this.reject) this.reject()
      })
    } else {
      this.visible = false
      if (this.reject) this.reject()
    }
  }

  onConfirm () {
    const vm = this
    if (this.uploading) {
      this.$message.info('正在上传文件， 请等待上传完毕')
      return
    }
    if (this.fileList.length < 1) {
      this.$message.info('请先上传文件')
    }
    if (this.isUpdate && this.fileList[0].name !== this.name) {
      this.$modal.confirm({ title: '提示', content: '更新文件名与原文件名不一致，是否继续更新?' }).then(() => {
        handle()
      }).catch(() => {
        // ignore
      })
      return
    }
    handle()

    function handle () {
      vm.request(vm.generateReq()).then(data => {
        vm.visible = false
        if (vm.resolve) vm.resolve(data)
      })
    }
  }

  request (req: any): Promise<any> {
    return this.isUpdate ? updateFileContent(this.id as number, req) : batchAddFile(req)
  }

  generateReq () {
    const vm = this as any
    let req: any = null
    const files = this.fileList.filter((v: any) => !!v.url)
    if (this.isUpdate) {
      req = {
        uuid: files[0].url,
        remark: this.form.remark
      }
      return req
    }
    if (this.directory) {
      // console.log(genDirReq(files))
      return genDirReq(files)
    }

    req = files.map((v: any) => {
      return {
        parentId: this.id,
        dir: false,
        name: v.name,
        uuid: v.url
      }
    })
    return req

    function genDirReq (files: any[]) {
      const META = '__//dir_upload_keyword__'
      const map = genMap(files)
      return Object.keys(map).map((key: any) => {
        return Object.assign({}, traverse(map[key]), { parentId: vm.id })
      })

      function traverse (obj: any) {
        if (!obj) return null
        let ret: any = {
          dir: obj[META].dir,
          name: obj[META].name,
          uuid: obj[META].uuid
        }
        let children = Object.keys(obj)
          .filter((key: any) => key !== META)
          .map((key: any) => {
            return traverse(obj[key])
          })
        if (children.length > 0) ret.children = children
        return ret
      }

      function genMap (files: any[]) {
        let map: any = {}
        files.forEach((v: any) => {
          putInMap(v)
        })
        return map

        function putInMap (file: any) {
          let parents = getPath(file).split('/')
          let name: any = parents.pop()
          if (parents.length < 1) return
          let context: any = map
          parents.forEach(v => {
            if (!context[v]) {
              context[v] = {
                [META]: {
                  dir: true,
                  name: v
                }
              }
            }
            context = context[v]
          })
          context[name] = {
            [META]: {
              dir: false,
              name,
              uuid: file.url
            }
          }
        }
      }

      function getPath (file: any): string {
        return file.originFileObj.webkitRelativePath
      }
    }

    // if (this.id) {
    //   req = {
    //     uuid: this.form.uuid,
    //     remark: this.form.remark
    //   }
    // } else {
    //   req = {
    //     dir: false,
    //     uuid: this.form.uuid,
    //     name: this.form.name
    //     // parentId: this.parentId
    //   }
    // }
  }

  // removeFile (): Promise<any> {
  //   if (this.form.uuid) {
  //     return remove(this.form.uuid)
  //   }
  //   return Promise.resolve()
  // }
}
</script>

<style lang="scss" module>
.body {
  height: 380px;
  overflow: auto;
}

.upload {
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
