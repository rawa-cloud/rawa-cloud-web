import Vue from 'vue'
import umask from './umask'
import transcode from './transcode'
import size from './size'
import ellipsis from './ellipsis'

const filters: any = {
  umask,
  transcode,
  size,
  ellipsis
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
