<template>
<v-form-item :prop="prop" :label="label">
  <v-range-picker v-model="value" start-placeholder="开始日期" end-placeholder="结束日期" clearable style="width: 100%;"></v-range-picker>
</v-form-item>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Control from '../Control'

@Component
export default class DateRangeControl extends mixins(Control) {
}
</script>
