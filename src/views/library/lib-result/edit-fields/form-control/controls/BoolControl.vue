<template>
<v-switch v-model="form[name]"></v-switch>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import Control from '../Control'

@Component
export default class BoolControl extends mixins(Control) {
}
</script>
