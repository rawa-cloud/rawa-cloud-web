<template>
  <div>
    <v-option :value="row.value" :label="row.label" v-for="(row, i) in options" :key="i"></v-option>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import dict, { getDict } from '@/common/dict'

@Component
export default class DictOption extends Vue {
  @Prop(String) name!: string

  get options () {
    const ret = (dict as any)[this.name]
    if (ret) {
      return Object.entries(ret).map(([k, v]) => ({ label: v, value: k }))
    }
    return getDict(this.name).map((v: any) => ({ label: v.label, value: v.code }))
  }
}
</script>

<style lang="scss" module>

</style>
