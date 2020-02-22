<template>
  <div>
    <v-option :value="row.value" :label="row.label" v-for="(row, i) in options" :key="i"></v-option>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import dict from '@/common/dict'

@Component
export default class DictOption extends Vue {
  @Prop(String) name!: string

  get options () {
    return Object.entries((dict as any)[this.name] || {}).map(([k, v]) => ({ label: v, value: k }))
  }
}
</script>

<style lang="scss" module>

</style>
