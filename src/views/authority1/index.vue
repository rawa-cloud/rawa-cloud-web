<template>
    <div :class="$style.container">
      <div :class="[$style.header]">
      </div>
      <div :class="[$style.body]">
        <div :class="[$style.left]">
          <div :class="[$style.dept]">
            <dept-tree @select="onSelectDept"></dept-tree>
          </div>
          <div :class="[$style.user]">
            <user-list @select="onSelectUser"></user-list>
          </div>
        </div>
        <div :class="[$style.right]">
          <file-tree @select="onSelectFile"></file-tree>
        </div>
      </div>
      <div :class="[$style.footer]" class="mt-3">
        <div>
          <template v-for="item in tags">
            <v-tag :key="item.name" v-if="item.visible" :class="[$style.tag]"
              color="primary" :type="item.checked ? 'depressed' : 'outline'"
              @click.native="onSelectTag(item.name)">{{item.text}}</v-tag>
          </template>
        </div>
        <edit-authority :dept="dept" :user="user" :file="file" v-if="tag === 'authority'"></edit-authority>
        <authority-list v-if="tag && tag !== 'authority'"></authority-list>
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

@Component({
  components: { DeptTree, UserList, FileTree, EditAuthority, AuthorityList }
})
export default class Authority extends Vue {
  dept: any = null

  file: any = null

  user: any = null

  tag: string = ''

  get tags () {
    const origin = [
      { name: 'dept', visible: !!this.dept, checked: this.tag === 'dept', text: `部门 : ${this.dept && this.dept.name}` },
      { name: 'user', visible: !!this.user, checked: this.tag === 'user', text: `用户 : ${this.user && this.user.username}` },
      { name: 'file', visible: !!this.file, checked: this.tag === 'file', text: `文件(夹) : ${this.file && this.file.name}` },
      { name: 'authority', visible: (this.file && (this.dept || this.user)), checked: this.tag === 'authority', text: `权限详细` }
    ]
    return origin
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
}
</script>

<style lang="scss" module>
.container{
  padding: 20px;
}

.header{
}

.body{
  display: flex;
  height: calc(100vh - 120px - 240px);
}

.left {
  display: flex;
  margin: 0 48px 0 0;
  padding: 20px;
  width: 55vw;
  border: 1px solid #e2e2e2;
  border-radius: .25rem;
  height: 100%;
}

.dept {
  width: 50%;
  margin: 0 20px 0 0;
  height: 100%;
  border: 1px solid #e2e2e2;
  border-radius: .25rem;
}

.user {
  width: 50%;
  height: 100%;
  border: 1px solid #e2e2e2;
  border-radius: .25rem;
}

.right {
  width: 45vw;
  border: 1px solid #e2e2e2;
  border-radius: .25rem;
  height: 100%;
  overflow: auto;
}

.footer {

}

.tag {
  cursor: pointer;
}
</style>
