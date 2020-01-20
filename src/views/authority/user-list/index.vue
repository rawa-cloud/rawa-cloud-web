<template>
    <div>
      <ul :class="[$style.list]" v-if="data.length > 0">
        <li :class="[$style.item, activeCls(row)]" v-for="row in data" :key="row.username" @click="onSelect(row)">{{row.username}} - {{row.cname}}</li>
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
  deptId: any = null

  data: any = []

  current: any = null

  @Emit() select (user: any) {}

  activeCls (row: any) {
    return row === this.current ? (this as any).$style.itemActive : ''
  }

  loadData (deptId: number) {
    this.deptId = deptId
    if (!this.deptId) {
      this.data = []
      return
    }
    let req = {
      deptId: this.deptId,
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
}
</script>

<style lang="scss" module>
.list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.item {
  line-height: 24px;
  padding: 2px 8px;
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
