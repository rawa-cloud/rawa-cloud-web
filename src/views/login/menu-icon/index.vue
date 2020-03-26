<template>
<div :class="[$style.container]">
  <ul :class="[$style.list]">
    <li :class="[$style.item]" v-for="(menu, i) in menus" :key="i">
      <div :class="[$style.itemInner]" @click="onLink(menu.url)">
        <div :class="[$style.icon]"><v-icon :type="menu.icon"></v-icon></div>
        <div :class="[$style.title]">{{menu.title}}</div>
        <div :class="[$style.caption]">{{menu.remark}}</div>
      </div>
    </li>
  </ul>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class MenuIcon extends Vue {
  menus = [
    { title: '企业网盘', icon: 'hdd', remark: 'Enterprise Disk', url: '/file' },
    { title: '部门管理', icon: 'shop', remark: 'Department Manage', url: '/dept' },
    { title: '用户管理', icon: 'user', remark: 'User Manage', url: '/user' },
    { title: '快速搜索', icon: 'search', remark: 'Fash Search', url: '/search' }
  ]

  onLink (url: string) {
    // this.$router.push(url)
  }
}
</script>

<style lang="scss" module>
.container {
  background-color: var(--primary-lighten-2);
  display: flex;
  justify-content: center;
}

.list {
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
}

.item {
  color: #fff;
  &:not(:last-child) {
    border-right: solid 1px #ccc;
  }
  padding: 24px 32px;
  text-align: center;
  min-width: 220px;
}

.itemInner {
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover{
    transform: translateY(-10px);
  }
}

.icon {
  font-size: 48px;
}

.title {
  font-size: 18px;
  margin: 24px 0 8px 0;
}

.caption {
  color: #eee;
}
</style>
