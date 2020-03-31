<template>
<v-form-item :prop="prop" :label="label">
  <v-select v-model="value" placeholder="请选择" clearable style="width: 100%;">
    <v-option :label="opt.label" :value="opt.value" v-for="(opt, i) in options" :key="i"></v-option>
  </v-select>
</v-form-item>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Control from '../Control'

@Component
export default class SelectControl extends mixins(Control) {
}
</script>
