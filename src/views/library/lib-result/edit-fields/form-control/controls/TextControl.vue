<template>
<v-input clearable v-model.trim="form[name]" :disabled="disabled"></v-input>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Control from '../Control'

@Component
export default class TextControl extends mixins(Control) {
}
</script>
