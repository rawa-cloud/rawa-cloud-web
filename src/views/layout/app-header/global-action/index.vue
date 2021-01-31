<template>
<div :class="[$style.container]" class="mx-2">
    <v-dropdown placement="bottom-end" :class="[$style.dropdown]">
        <div :class="[$style.reference]">
            <div style="height: auto;" class="px-2">
                <i style="color: #fff;"><v-icon type="logout"></v-icon></i>
            </div>
        </div>
        <v-dropdown-menu slot="dropdown">
            <v-dropdown-item class="w-8" @click.native="onLink('/user-setting')">
                <v-icon type="user"></v-icon> <span class="ml-3">个人设置</span>
            </v-dropdown-item>
            <v-dropdown-item divider></v-dropdown-item>
            <v-dropdown-item @click.native="onLogout">
                <v-icon type="logout"></v-icon> <span class="ml-3">退出登录</span>
            </v-dropdown-item>
        </v-dropdown-menu>
    </v-dropdown>
</div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'

@Component
export default class GlobalAction extends Vue {
  get username () {
    return this.$auth.username
  }

  onLink (path: string) {
    this.$router.push(path)
  }

  onLogout () {
    this.$auth.logout()
  }
}
</script>

<style lang="scss" module>
.container {
    height: 100%;
    display: flex;
    align-items: center;
    padding-right: 8px;
    transition: background-color .35s ease;
    &:hover {
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
</style>
