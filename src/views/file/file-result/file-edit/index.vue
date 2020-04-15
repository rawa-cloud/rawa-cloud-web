<template>
<office-editor :row="row" editable v-if="row"></office-editor>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class FileEdit extends Vue {
  row: any = null

  edit (row: any) {
    this.row = row
    this.$nextTick(() => {
      this.row = null
    })
  }
}
</script>
