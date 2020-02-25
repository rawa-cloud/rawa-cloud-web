<template>
<v-textarea placeholder="请输入内容" v-model.trim="form[name]"></v-textarea>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Control from '../Control'

@Component
export default class MultiTextControl extends mixins(Control) {
}
</script>
