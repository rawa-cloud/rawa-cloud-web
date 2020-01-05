<template>
<div>
    <v-input v-model.trim="value" placeholder="搜索" suffix="search" @keyup.enter.native="onSearch"></v-input>
</div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'

@Component
export default class GlobalSearch extends Vue {
    value: string = ''

    onSearch () {
      if (this.value) {
        this.$router.push(`/search?name=${this.value}`)
      }
    }
}
</script>
