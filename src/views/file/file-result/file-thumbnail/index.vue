<template>
    <div>
        <ul :class="[$style.list]">
            <li :class="[$style.item, activeCls(row)]" v-for="(row, i) in renderedDataSource" :key="i" @click="onPreview(row)">
              <!-- <div class="text-center">
                  <img :src="imageUrl(row)" :class="[$style.thumbnail]" v-if="imageUrl(row)">
                  <file-icon v-bind="iconProps(row)" class="ft-64" v-else></file-icon>
              </div>
              <div class="text-truncate text-center px-3">{{row.name}}</div>
              <div :class="[$style.checkbox]" @click.stop="onCheck(row)"><v-icon type="check-circle"></v-icon></div> -->
              <v-dropdown trigger="contextMenu" :class="[$style.dropdown]">
                <div :class="[$style.box]" @contextmenu="onRowMenu(row)">
                  <div :class="[$style.icon]">
                    <img :src="imageUrl(row)" :class="[$style.thumbnail]" v-if="imageUrl(row)">
                    <file-icon v-bind="iconProps(row)" class="ft-64" v-else></file-icon>
                  </div>
                  <div class="text-truncate text-center px-3" :title="row.name">{{row.name}}</div>
                  <div :class="[$style.checkbox]" @click.stop="onCheck(row)"><v-icon type="check-circle"></v-icon></div>
                </div>
                <v-dropdown-menu slot="dropdown">
                  <v-dropdown-item @click.native="row.action()" v-for="(row, i) in menus" :key="i" :class="[$style.menu]">
                    <span> {{row.title}} </span>
                  </v-dropdown-item>
                </v-dropdown-menu>
              </v-dropdown>
            </li>
        </ul>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Emit, Inject } from 'vue-property-decorator'
import { getType } from '@/common/content-type'

const baseUrl = process.env.VUE_APP_API_BASE_URL

@Component
export default class FileThumbnail extends Vue {
    @Prop(Array) dataSource!: any[]

    @Prop(Array) checkedRows!: any[]

    @Emit('update:checked-rows') updateCheckedRows (files: any) {}

    @Inject() onPreview!: (row: any) => void

    @Inject() filterActions!: (row?: any) => any[]

    get menus () {
      return this.filterActions()
    }

    get renderedDataSource () {
      return this.dataSource.filter(v => !v.dir)
    }

    iconProps (row: any) {
      let dir = row.dir
      let personal = row.personal
      let root = false
      let contentType = row.contentType
      return { dir, personal, root, contentType }
    }

    activeCls (row: any) {
      return this.checkedRows.includes(row) ? (this as any).$style.active : ''
    }

    imageUrl (row: any) {
      if (getType(row.contentType) !== 'image') return ''
      return `${baseUrl}/files/${row.id}/preview`
    }

    onCheck (row: any) {
      let copy = this.checkedRows.slice()
      let idx = copy.findIndex((v: any) => v === row)
      if (idx !== -1) {
        copy.splice(idx, 1)
      } else {
        copy.push(row)
      }
      this.updateCheckedRows(copy)
    }

    onRowMenu (row: any) {
      if (this.checkedRows.some(v => v === row)) return
      this.updateCheckedRows([row])
    }
}
</script>

<style lang="scss" module>
.list{
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  width: 0;
  min-width: 100%;
  flex-wrap: wrap;
  max-height: calc(100vh - 64px - 40px - 36px - 8px);
  overflow: auto;
}

.item {
    width: 120px;
    height: 127px;
    margin: 4px 0 0 6px;
    border-radius: 4px;
    position: relative;
    border: 1px solid transparent;
    &:hover {
      background-color: var(--primary-lighten-5);
      transition: background-color .35s ease;
      & .checkbox {
        visibility: visible;
      }
    }
    &.active {
        background-color: var(--primary-lighten-5);
        border-color: var(--primary-base);
        & .checkbox {
          visibility: visible;
          color: var(--primary-base);
        }
    }
}

.dropdown {
  :global {
    .v-dropdown__popper {
      display: block;
    }
  }
}

.box {
  width: 100%;
}

.icon {
  text-align: center;
  height: 96px;
}

.checkbox {
    position: absolute;
    left: 4px;
    top: 4px;
    color: var(--primary-lighten-3);
    visibility: hidden;

    &:hover {
      color: var(--primary-lighten-2);
      cursor: pointer;
    }
}

.menu {
  width: 120px;
  padding-left: 32px;
}

.thumbnail {
    max-width: 100%;
    max-height: 94px;
    padding: 4px;
    border-radius: 4px;
}
</style>
