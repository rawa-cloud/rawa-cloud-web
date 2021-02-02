import { Module } from 'vuex'

class DictState {
  items: any = {}
}

const dict: Module<DictState, any> = {
  namespaced: true,
  state: new DictState(),
  mutations: {
    setItems (state: any, items: any[]) {
      const map: any = {}
      items.forEach((v: any) => {
        if (!map[v.name]) map[v.name] = []
        const ret = map[v.name]
        ret.push(v)
      })
      state.items = map
    }
  },
  getters: {
    options (state: any) {
      return state.items
    }
  },
  actions: {}
}

export default dict
