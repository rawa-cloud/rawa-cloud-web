<template>
<div :class="[$style.container]">
    <nav-menu :class="[$style.menu]"></nav-menu>

    <div :class="[$style.hoverTrigger]" class="text-secondary" @click="onTrigger">
        <v-icon :type="iconType"></v-icon>
    </div>
</div>
</template>

<script lang="ts">

import { Vue, Component, Inject } from 'vue-property-decorator'
import NavMenu from './nav-menu/index.vue'
import { AppModule } from '../../../store'

@Component({
  components: { NavMenu }
})
export default class AppSider extends Vue {
    @AppModule.State expand!: boolean

    @AppModule.Mutation setExpand!: (expand: boolean) => void

    get iconType () {
      return this.expand ? 'left-circle' : 'right-circle'
    }

    onTrigger () {
      this.setExpand(!this.expand)
    }
}
</script>

<style lang="scss" module>
.container {
    background-color: var(--bg-color);
    box-shadow: 2px 0 6px var(--bg-color-2);
    position: relative;
    height: 100%;
    overflow: auto;
}

.menu {
  width: 194px;
  height: calc(100vh - 4rem - 80px);
  overflow: auto;
  border-right-color: transparent;

  :global {
    .v-menu-item {
      color: var(--text-color-secondary) !important;
    }
  }
}

.hoverTrigger {
    text-align: center;
    font-size: 20px;
    // color: #999;
    transition: all .3s;
    &:hover {
      color: var(--primary-base);
      cursor: pointer;
      &>* {
        transform: scale(1.1);
      }
    }
}
</style>
