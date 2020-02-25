<template>
<v-checkbox-group v-model="form[name]" v-if="max <= 5">
  <v-checkbox :label="opt.name" v-for="(opt, i) in options" :key="i">{{opt.name}}</v-checkbox>
</v-checkbox-group>
<v-select v-model="form[name]" placeholder="请选择" multiple clearable v-else>
  <v-option :label="opt.name" :value="opt.name" v-for="(opt, i) in options" :key="i"></v-option>
</v-select>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Control from '../Control'

@Component
export default class CheckboxControl extends mixins(Control) {
  get max () {
    return (this.options || []).length
  }
}
</script>
