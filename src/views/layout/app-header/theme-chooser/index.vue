<template>
<div :class="[$style.container]">
    <!-- <v-dropdown placement="bottom-end" :class="[$style.dropdown]" trigger="click">
        <div :class="[$style.reference]">
            <div style="height: auto;" class="px-2">
                <v-icon type="global" class="ft-lg" style="color: #fff;"></v-icon>
            </div>
        </div>
        <v-dropdown-menu slot="dropdown">
            <v-dropdown-item >
                <v-switch v-model="dark" size="sm" @click.native.stop=""></v-switch> <span class="ml-2">明/暗模式</span>
            </v-dropdown-item>
            <v-dropdown-item >
                <v-switch v-model="sider.dark" size="sm" @click.native.stop=""></v-switch> <span class="ml-2">侧边栏</span>
            </v-dropdown-item>
            <v-dropdown-item >
                <v-switch v-model="header.dark" size="sm" @click.native.stop=""></v-switch> <span class="ml-2">头部</span>
            </v-dropdown-item>
            <v-dropdown-item divider></v-dropdown-item>
            <v-dropdown-item class="w-8">
                "<input type="color" @click.stop="" v-model="primary"> <span class="text-primary ml-2> 主题色 </span>
            </v-dropdown-item>
        </v-dropdown-menu>
    </v-dropdown> -->
  <div :class="[$style.box]">
    <input type="color" @click.stop="" v-model="primary">
  </div>
  <span>主题</span>
</div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'
import appConfig from '@/common/app-config'

@Component
export default class ThemeChooser extends Vue {
  get sider () {
    return appConfig.sider
  }

  get header () {
    return appConfig.header
  }

  get dark () {
    let dark = !!appConfig.dark
    this.$vua.dark = dark
    return !!this.$vua.dark
  }

  set dark (dark: boolean) {
    this.$vua.dark = !!dark
    appConfig.dark = !!dark
  }

  get primary () {
    let primary = appConfig.primary || ''
    this.$vua.theme.primary = primary
    return this.$vua.theme.primary
  }

  set primary (value: string) {
    appConfig.primary = value || ''
    console.log(appConfig)
    this.$vua.theme.primary = appConfig.primary
  }
}
</script>

<style lang="scss" module>
.container {
    height: 100%;
    display: flex;
    align-items: center;
    transition: background-color .35s ease;
    color: var(--text-color-secondary);
    &:hover {
        background: var(--primary-lighten-5);
        cursor: pointer;
    }
}

.dropdown {
    display: block;
    height: 100%;

    & * {
        height: 100%;
    }
}

.reference {
    height: 100%;
    display: flex;
    align-items: center;
}

.box {
  width: 30px;
  height: 30px;
  padding: 2px;
  border: 1px solid #E7E9EB;
  border-radius: 4px;
  margin-right: 8px;
  &>* {
    width: 24px;
    height: 24px;
    background-color: var(--primary-base);
    border-radius: 4px;
    &:active, &:focus {
      outline: 0;
      border-color: none;
      box-shadow: none;
    }
  }
}
</style>
