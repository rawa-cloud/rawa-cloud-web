<template>
    <div>
      <ul :class="[$style.list]" v-if="data.length > 0">
        <li :class="[$style.item, activeCls(row)]" v-for="(row, i) in data" :key="row.username" @click="onSelect(row)">
          <v-avatar size="sm" type="char" shape="circle" :background-color="background(i)" color="#fff" class="ml-3">{{(row.cname || '').slice(0, 1)}}</v-avatar>
          <span class="ml-2">{{row.cname}}</span>
          <span class="ml-2 caption">{{row.username}}</span>
        </li>
      </ul>
      <div v-else>
        <no-data></no-data>
      </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { queryUsers } from '../../../api/user'

@Component
export default class UserList extends Vue {
  @Prop() dept!: any

  data: any = []

  current: any = null

  @Emit() select (user: any) {}

  activeCls (row: any) {
    return row === this.current ? (this as any).$style.itemActive : ''
  }

  background (i: number) {
    const items = ['success', 'primary', 'info', 'warning', 'error', 'secondary']
    return items[i % items.length]
  }

  loadData () {
    const deptId = this.dept && this.dept.id
    if (!deptId) {
      this.data = []
      return
    }
    let req = {
      deptId: deptId,
      status: true
    }
    queryUsers(req).then(data => {
      this.data = data || []
    })
  }

  onSelect (row: any) {
    this.current = row
    this.select(row)
  }

  mounted () {
    this.loadData()
  }
}
</script>

<style lang="scss" module>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.item {
  line-height: 32px;
  padding: 2px 4px;
  margin: 2px 0;
  border-radius: 4px;
  transition: ease-in-out .25s all;

  &:hover {
    cursor: pointer;
    background-color: #fafafa;
  }
}

.itemActive {
  background-color: var(--primary-lighten-5) !important;
}
</style>
