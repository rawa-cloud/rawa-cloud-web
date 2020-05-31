<template>
<v-range-picker show-time v-model="form[name]" start-placeholder="开始日期" end-placeholder="结束日期" clearable :disabled="disabled"></v-range-picker>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Control from '../Control'

@Component
export default class DatetimeRangeControl extends mixins(Control) {
}
</script>
