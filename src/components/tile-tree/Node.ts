export default class Node {
  data: any
  parent: Node | null = null
  children?: Node[]
  isRoot: boolean = false
  root!: Node
  store?: Map<string, any>
  current?: Node | null
  level!: number
  key?: string

  constructor (data: any, parent: Node | null, key: string) {
    this.data = data
    this.parent = parent
    if (!parent) {
      this.isRoot = true
      this.root = this
      this.root.store = new Map()
      this.key = key
      this.current = null
    } else {
      this.isRoot = false
      this.root = parent.root
    }
    const store = (this.root.store as Map<string, Node>)
    if (!this.isRoot) store.set(data[key], this)
    this.level = this.parent ? this.parent.level + 1 : 0
    const children = this.isRoot ? data : data.children
    if (Array.isArray(children)) {
      this.children = children.map((v: any) => new Node(v, this, key))
    }
  }

  get id () {
    if (this.isRoot) return ''
    return this.data[this.root.key as string]
  }

  setCurrent (current: string | Node) {
    if (!current) this.root.current = null
    if (typeof current === 'string') {
      current = (this.root.store as any).get(current) || null
    }

    while (current && (current as Node).level > 0) {
      let item = (this.root.store as any).get((current as Node).id)
      if (item) {
        current = item
        break
      }
      current = (current as any).parent
    }
    this.root.current = (current as any) || null
  }

  isCurrentNode (node: Node = this, current?: Node | null) {
    current = current || this.root.current
    if (!current) return false
    return node === current || node.id === current.id
  }

  isParentNode (node: Node = this) {
    let current = this.root.current
    if (!current) return false
    current = current.parent
    while (current) {
      if (this.isCurrentNode(node, current)) return true
      current = current.parent
    }
    return false
  }
}
