<template>
    <div :class="$style.container">
      <div :class="[$style.header]">
      </div>
      <div :class="[$style.body]">
        <v-row :gutter="24">
          <v-col :span="8">
            <div :class="[$style.title]">选择文件</div>
            <v-card :class="[$style.bodyCard]"><file-tree @select="onSelectFile"></file-tree></v-card>
          </v-col>
          <v-col :span="8">
            <div :class="[$style.title]">
              <span>选择{{userDept ? '用户' : '部门'}}</span>
              <a class="ml-3" @click="onBackToDept" v-if="userDept">返回部门</a>
            </div>
            <div>
              <v-card :class="[$style.bodyCard]">
                <dept-tree @select="onSelectDept" @view-user="onViewUser" v-if="!userDept"></dept-tree>
                <user-list @select="onSelectUser" :dept="userDept" v-else></user-list>
              </v-card>
            </div>
          </v-col>
          <v-col :span="8">
            <div :class="[$style.title]">编辑权限</div>
            <v-card :class="[$style.bodyCard]">
              <edit-authority :dept="dept" :user="user" :file="file" v-if="file && (dept || user)"></edit-authority>
            </v-card>
          </v-col>
          <!-- <v-col :span="8">

          </v-col> -->
        </v-row>
      </div>
      <div :class="[$style.footer]" class="mt-3">
        <div class="mb-3">
          <template v-for="item in tags">
            <v-tag :key="item.name" v-if="item.visible" :class="[$style.tag]"
              :color="item.type" :type="item.checked ? 'depressed' : 'outline'"
              @click.native="onSelectTag(item.name)">{{item.text}}</v-tag>
          </template>
        </div>

        <v-card v-if="tag">
          <authority-list :dept="dept" :user="user" :file="file" :tag="tag" v-if="tag && tag !== 'authority'"></authority-list>
        </v-card>
      </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import DeptTree from './dept-tree/index.vue'
import UserList from './user-list/index.vue'
import FileTree from './file-tree/index.vue'
import EditAuthority from './edit-authority/index.vue'
import AuthorityList from './authority-list/index.vue'
import { getDept } from '../../api/dept'
import { getUser } from '../../api/user'
import { getFile } from '../../api/file'

@Component({
  components: { DeptTree, UserList, FileTree, EditAuthority, AuthorityList }
})
export default class Authority extends Vue {
  dept: any = null

  file: any = null

  user: any = null

  userDept: any = null

  tag: string = ''

  get tags () {
    const origin = [
      { name: 'file', visible: !!this.file, checked: this.tag === 'file', text: `文件(夹) : ${this.file && this.file.name}`, type: 'info' },
      { name: 'dept', visible: !!this.dept, checked: this.tag === 'dept', text: `部门 : ${this.dept && this.dept.name}`, type: 'info' },
      { name: 'user', visible: !!this.user, checked: this.tag === 'user', text: `用户 : ${this.user && this.user.username}`, type: 'info' }
    ]
    return origin
  }

  get query () {
    let query = this.$route.query || {}
    return {
      principleId: query.principleId || null,
      isUser: query.isUser === '1',
      fileId: query.fileId || null,
      t: query.t || null
    }
  }

  onSelectDept (dept: any) {
    this.dept = dept
    this.user = null
  }

  onSelectUser (user: any) {
    this.user = user
    this.dept = null
  }

  onSelectFile (file: any) {
    this.file = file
  }

  onSelectTag (tag: string) {
    this.tag = tag
  }

  onViewUser (dept: any) {
    this.userDept = dept
  }

  onBackToDept () {
    this.userDept = null
  }

  @Watch('query', { immediate: true }) queryChange () {
    let { principleId, isUser, fileId } = this.query
    if (!principleId && !fileId) return
    let all: any[] = []
    if (principleId) {
      if (isUser) {
        all.push(Promise.resolve(0))
        all.push(getUser(principleId as any))
      } else {
        all.push(getDept(principleId as any))
        all.push(Promise.resolve(0))
      }
    } else {
      all.push(Promise.resolve(0))
      all.push(Promise.resolve(0))
    }

    if (fileId) {
      all.push(getFile(fileId as any))
    } else all.push(Promise.resolve(0))

    Promise.all(all).then(([dept, user, file]) => {
      this.dept = dept || null
      this.user = user || null
      this.file = file || null

      if (this.file && (this.dept || this.user)) {
        this.tag = 'authority'
      } else if (this.file) {
        this.tag = 'file'
      } else if (this.dept) {
        this.tag = 'dept'
      } else if (this.user) {
        this.tag = 'user'
      }
    })
  }
}
</script>

<style lang="scss" module>
.container{
  padding: 20px;
}

.header{
}

.title {
  line-height: 32px;
  position: relative;
  padding: 0 0 0 6px;

  &:before {
    content: " ";
    position: absolute;
    top: 9px;
    bottom: 9px;
    left: 0;
    width: 3px;
    background-color: var(--primary-base);
  }
}

.bodyCard{
  height: calc(100vh - 120px - 240px);
  overflow: auto;
}

.footer {

}

.tag {
  cursor: pointer;
}
</style>
