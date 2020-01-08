<template>
  <div>
    <div :class="[$style.header]">
      <div :class="[$style.logoBox]">
        <img src="@/assets/logo.png" :class="[$style.logo]">
        <div class="ml-2">
          <div class="text-heading font-weight-bold ft-lg mt-2">瑞柚云盘</div>
          <div class="ft-lg">Rawa Cloud</div>
        </div>
      </div>
      <div>
          <a v-if="$auth.username">{{$auth.username}}</a>
          <v-button type="outline" @click="onLink('/login')" v-else> 登 录 </v-button>
      </div>
    </div>
    <div :class="[$style.main]">
      <v-carousel trigger="click" style="height: calc(100vh - 80px - 200px);">
        <v-carousel-item v-for="(img, i) in images" :key="i"><img :src="img"></v-carousel-item>
      </v-carousel>
    </div>
    <div :class="[$style.footer]">
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {}
})
export default class Portal extends Vue {
  images = [
    'https://cdn.goodq.top/caches/0018ab795b473ef841db157552829fbc/aHR0cDovL3d3dy5sZWdhY3ljaGluYS5jb20vcWZ5LWNvbnRlbnQvdXBsb2Fkcy8yMDE5LzAyL2U2ZDVjODJhYWQ0MzM2NTVhMmNlN2ZmNzUwYTExNmY4LmpwZw_p_p100_p_3D_p_p100_p_3D.jpg',
    'https://cdn.goodq.top/caches/0018ab795b473ef841db157552829fbc/aHR0cDovL3d3dy5sZWdhY3ljaGluYS5jb20vcWZ5LWNvbnRlbnQvdXBsb2Fkcy8yMDE5LzAyLzg2NTU0OGU4Y2Y5ZTYyM2RiZDZmNjQxNzJiYzUzY2M1LmpwZw_p_p100_p_3D_p_p100_p_3D.jpg',
    'https://cdn.goodq.top/caches/0018ab795b473ef841db157552829fbc/aHR0cDovL3d3dy5sZWdhY3ljaGluYS5jb20vcWZ5LWNvbnRlbnQvdXBsb2Fkcy8yMDE5LzAyLzE4ZmUzMTk4ODhlZDMzY2JhZGU0ODMyMDFmNWY2ZTZkLmpwZw_p_p100_p_3D_p_p100_p_3D.jpg',
    'https://cdn.goodq.top/caches/0018ab795b473ef841db157552829fbc/aHR0cDovL3d3dy5sZWdhY3ljaGluYS5jb20vcWZ5LWNvbnRlbnQvdXBsb2Fkcy8yMDE5LzAyLzVkZjdjMDBjN2ZiNzU1NjM1ZGQ2NjM5MTJkOTg4ZjM0LmpwZw_p_p100_p_3D_p_p100_p_3D.jpg'
  ]

  menus = [
    { title: '企业网盘', icon: 'hdd', remark: 'Enterprise Disk', url: '/file' },
    { title: '部门管理', icon: 'shop', remark: 'Department Manage', url: '/dept' },
    { title: '用户管理', icon: 'user', remark: 'User Manage', url: '/user' },
    { title: '快速搜索', icon: 'search', remark: 'Fash Search', url: '/search' }
  ]

  onLink (url: string) {
    this.$router.push(url)
  }
}
</script>

<style lang="scss" module>
.header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 16px;
}
.logoBox {
  display: flex;
  align-items: center;
}
.logo {
  width: 65px;
  height: 65px;
  display: inline-block;
}

.footer {
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
