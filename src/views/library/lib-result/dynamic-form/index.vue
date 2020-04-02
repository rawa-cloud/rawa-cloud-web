<template>
<v-form layout="horizontal" class="mx-3 mt-3" :model="form" ref="form">
   <v-row :gutter="16" style="width: 100%;">
      <v-col :span="8" v-for="row in renderedFields" :key="row.i">
        <form-control :form="form" :prop="row.id + ''" :label="row.name" :type="resolveType(row)" :options="resolveOptions(row)"></form-control>
      </v-col>
      <v-col :span="8">
        <v-form-item >
          <v-button type="primary" @click="onQuery">查询</v-button>
          <v-button class="ml-3" @click="onReset">重置</v-button>
          <v-button type="text" @click="collapse = !collapse">
            <v-icon type="down" v-if="collapse"></v-icon>
            <v-icon type="up" v-else></v-icon>
          </v-button>
        </v-form-item>
      </v-col>
    </v-row>
</v-form>
</template>

<script lang="ts">

import { Vue, Component, Inject, Prop, Watch, Emit } from 'vue-property-decorator'
import FormControl from './form-control/index.vue'
const typeMap: any = {
  'text': 'text',
  'multi_text': 'text',
  'radio': 'select',
  'checkbox': 'select',
  'bool': 'select',
  'date': 'date_range',
  'date_range': 'date_range',
  'datetime': 'datetime_range',
  'datetime_range': 'datetime_range'
}
@Component({
  components: { FormControl }
})
export default class DynamicForm extends Vue {
  @Prop(Array) fields!: any

  @Emit() query (params: any) {}

  form: any = {}

  collapse = true

  get renderedFields () {
    return this.collapse ? (this.fields || []).slice(0, 5) : this.fields
  }

  onQuery () {
    this.query(Object.assign({}, this.form))
  }

  onReset () {
    this.form = {}
  }

  resolveType (row: any) {
    return typeMap[row.type]
  }

  resolveOptions (row: any) {
    return (row.typeDictList || []).map((v: any) => {
      return {
        label: v.name,
        value: v.name
      }
    })
  }
}
</script>
