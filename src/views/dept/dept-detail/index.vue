<template>
    <div class="p-3">
        <div v-if="dept">
          <div>
            <section-header>基本信息</section-header>
            <div>
                  <span>
                      <span> <span class="text-secondary mr-3">部门名称:</span> <span>{{dept && dept.name}}</span></span>
                  </span>
              </div>
          </div>

          <div class="mt-4">
            <section-header>用户列表</section-header>
            <v-table pageable :data-source="dataSource">
                <v-table-column prop="username" label="用户名"></v-table-column>
                <v-table-column prop="cname" label="姓名"></v-table-column>
                <v-table-column prop="deptName" label="所属部门"></v-table-column>
                <v-table-column prop="ip" label="ip"></v-table-column>
                <v-table-column prop="status" label="状态">
                  <template slot-scope="{row}">{{row.status | transcode('status')}}</template>
                </v-table-column>
            </v-table>
          </div>
        </div>
        <div v-else>
          <no-data></no-data>
        </div>
    </div>
</template>

<script lang="ts">

import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { getDept } from '@/api/dept'
import { queryUsers } from '@/api/user'

@Component
export default class DeptDetail extends Vue {
    @Prop(Number) id!: number

    dept: any = null

    dataSource: any[] = []

    loadDept () {
      if (!this.id) {
        this.dept = null
        return
      }
      getDept(this.id).then(data => {
        this.dept = data || null
      })
    }

    loadUser () {
      if (!this.id) {
        this.dataSource = []
        return
      }
      queryUsers({ deptId: this.id }).then(data => {
        this.dataSource = data || []
      })
    }

    @Watch('id', { immediate: true }) idChange () {
      this.loadDept()
      this.loadUser()
    }
}
</script>
