<template>
<v-date-picker v-model="form[name]" placeholder="请选择日期" show-time clearable :disabled="disabled"></v-date-picker>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Control from '../Control'

@Component
export default class DatetimeControl extends mixins(Control) {
}
</script>
