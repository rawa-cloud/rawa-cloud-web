const map: any = {
  // image
  image: {
    'gif': 'gif',
    'ico': 'ico',
    'jpg': 'jpg',
    'jpeg': 'jpg',
    'png': 'png'
  },
  // office
  office: {
    'doc': 'word',
    'docx': 'word',
    'xls': 'excel',
    'xlsx': 'excel',
    'ppt': 'ppt',
    'pptx': 'ppt',
    'pdf': 'pdf'
  },
  audio: {
    'mp3': 'audio',
    'ogg': 'audio'
  },
  video: {
    'mp4': 'video',
    'webm': 'video',
    'ogv': 'video'
  },
  text: {
    'txt': 'text',
    'md': 'text',
    'log': 'text'
  }
}

export const iconMap = getIconMap()

export function getType (suffix: string) {
  if (!suffix) return ''
  return Object.keys(map).find((v: string) => {
    return !!(map[v] && map[v][suffix.toLowerCase()])
  }) || ''
}

export function isImage (suffix: string) {
  return getType(suffix) === 'image'
}

function getIconMap () {
  let ret: any = {}
  Object.values(map).forEach(v => {
    Object.assign(ret, v)
  })
  return ret
}
