import Vue from 'vue'

export default new Vue({
  data: {
    store: {}
  },
  methods: {
    set (key: string, value: any) {
      const vm: any = this
      let ret = JSON.stringify(value || null)
      let k = vm.resolveKey(key)
      vm.$set(vm.store, k, JSON.parse(ret))
      window.localStorage.setItem(k, ret)
    },
    get (key: string) {
      const vm: any = this
      let k = vm.resolveKey(key)
      if (vm.store[k] === undefined) {
        let ret = window.localStorage.getItem(k)
        ret = ret ? JSON.parse(ret) : null
        vm.$set(vm.store, k, ret)
      }
      return vm.store[k]
    },
    resolveKey (key: string) {
      return ((this.$auth && this.$auth.username) || 'anonymous') + '_' + key
    }
  }
})
