<template>
<v-radio-group v-model="form[name]" v-if="max <= 5">
  <v-radio :label="opt.name" v-for="(opt, i) in options" :key="i">{{opt.name}}</v-radio>
</v-radio-group>
<v-select v-model="form[name]" placeholder="请选择" clearable v-else>
  <v-option :label="opt.name" :value="opt.name" v-for="(opt, i) in options" :key="i"></v-option>
</v-select>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Control from '../Control'

@Component
export default class RadioControl extends mixins(Control) {
  get max () {
    return (this.options || []).length
  }
}
</script>
