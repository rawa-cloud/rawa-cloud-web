<template>
<div :class="[$style.container]">
    <div class="d-flex align-items-center" style="height: 100%;">
      <div :class="[$style.logo]" @click="onIndex">
        <img src="@/assets/logo.png" alt="&times;" :class="[$style.img]"/>
        <span class="ml-2"> 龙华智能消防-图纸管理系统</span>
      </div>

      <!-- <catalog-menu :class="[$style.menu]" style="margin-left: 48px;"></catalog-menu> -->
    </div>

    <span :class="[$style.opt]">
        <!-- <global-search></global-search> -->
        <!-- <v-divider type="vertical" class="mx-4" style="height: 22px;"></v-divider>
        <theme-chooser></theme-chooser> -->
        <!-- <global-message></global-message> -->
        <span v-if="cname"><i class="mr-1"><v-icon type="user"></v-icon></i>{{cname}}</span>
        <span class="ml-3" v-if="deptName"><i class="mr-1"><v-icon type="usb"></v-icon></i>{{deptName}}</span>
        <span class="ml-3">{{date}}</span>
        <global-action></global-action>
    </span>
</div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import GlobalSearch from './global-search/index.vue'
import GlobalMessage from './global-message/index.vue'
import GlobalAction from './global-action/index.vue'
import ThemeChooser from './theme-chooser/index.vue'
import CatalogMenu from './catalog-menu/index.vue'

@Component({
  components: { GlobalSearch, GlobalMessage, GlobalAction, ThemeChooser, CatalogMenu }
})
export default class AppHeader extends Vue {
  onIndex () {
    this.$router.push('/')
  }

  get cname () {
    return (this as any).$auth.principle.cname
  }

  get deptName () {
    return (this as any).$auth.principle.deptName
  }

  get date () {
    const weekMap: any = {
      1: '星期一',
      2: '星期二',
      3: '星期三',
      4: '星期四',
      5: '星期五',
      6: '星期六',
      7: '星期日'
    }
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const week = now.getDay() + 1
    return `${year}-${month}-${day} ${weekMap[week]}`
  }
}
</script>

<style lang="scss" module>
.container {
    height: 100%;
    background-color: #22272f;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
}

.opt {
    display: flex;
    align-items: center;
    height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  margin-left: 12px;
  font-size: 18px;
  &:hover {
      cursor: pointer;
  }
}

.img {
  height: 21px;
  width: 21px;
  margin-left: 8px;
}

.menu {
  margin-left: 24px;
}
</style>
