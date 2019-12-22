import Vue from 'vue'
import umask from './umask'
import transcode from './transcode'
import size from './size'

const filters: any = {
  umask,
  transcode,
  size
}

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
