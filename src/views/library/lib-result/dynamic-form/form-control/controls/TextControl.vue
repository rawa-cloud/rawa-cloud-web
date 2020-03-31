<template>
<v-form-item :prop="prop" :label="label">
<v-input clearable v-model.trim="value" style="width: 100%;"></v-input>
</v-form-item>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Control from '../Control'

@Component
export default class TextControl extends mixins(Control) {
}
</script>
