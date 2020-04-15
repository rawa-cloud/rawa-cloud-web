<template>
<div></div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit, Watch, Inject } from 'vue-property-decorator'

@Component
export default class FileEdit extends Vue {
    @Prop() row!: any[]
}
</script>
