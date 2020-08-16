<template>
  <v-layout :class="[$style.container]">
    <v-header :class="[$style.header]" class="shadow-1-down" :dark="header.dark ? {} : undefined">
        <app-header></app-header>
    </v-header>
    <v-layout :class="[$style.main]">
      <v-sider :dark="sider.dark ? {} : undefined" :class="[$style.sider]">
          <app-sider></app-sider>
      </v-sider>
      <v-content :class="[$style.content]">
          <router-view/>
      </v-content>
      <!-- <v-footer :class="[$style.footer]">
          <app-footer></app-footer>
      </v-footer> -->
    </v-layout>
  </v-layout>
</template>

<script lang="ts">

import { Vue, Component, Provide } from 'vue-property-decorator'
import AppHeader from './app-header/index.vue'
import AppSider from './app-sider/index.vue'
import AppFooter from './app-footer/index.vue'
import appConfig from '@/common/app-config'

@Component({
  components: { AppHeader, AppSider, AppFooter }
})
export default class Layout extends Vue {
  get header () {
    return appConfig.header
  }

  get sider () {
    return appConfig.sider
  }
}
</script>

<style lang="scss" module>
.container {
  background-color: #fff;
}

.header {
    height: 4rem;
    padding: 0;
    background-color: var(--bg-color);
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.main {
  background-color: #fff;
  height: calc(100vh - 64px);
  background: transparent;
  padding-top: 8px;
}

.sider {
  height: 100%;
}

.content {
  overflow: auto;
  height: 100%;
}
</style>
