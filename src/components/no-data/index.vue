<template>
  <v-empty><svg-icon style="font-size: 100px;" slot="image" icon="no-data"></svg-icon></v-empty>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class NoData extends Vue {

}
</script>

<style lang="scss" module>

</style>
