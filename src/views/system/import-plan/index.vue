<template>
<div>
  导入计划
</div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator'

@Component
export default class ImportPlan extends Vue {
  dataSource: any = {}
}
</script>

<style lang="scss" module>
.text {
  line-height: 32px;
}
</style>
