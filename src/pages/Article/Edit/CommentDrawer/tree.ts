import { Comment } from '@/constants/comment'

export interface CommentTree extends Comment {
  children?: CommentTree[]
  reply_to?: Comment
}

export const transformCommentListToTree = (comments: Comment[]): CommentTree[] => {
  const roots: CommentTree[] = []
  const map: Record<number, CommentTree> = {}

  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i]
    map[comment.id] = { ...comment, children: [] }
  }

  const findRootId = (id: number): number => {
    let current = map[id]
    while (current && current.parent_id && map[current.parent_id]) {
      current = map[current.parent_id]
    }
    return current ? current.id : id
  }

  for (let i = 0; i < comments.length; i++) {
    const node = map[comments[i].id]
    const parentId = node.parent_id

    if (!parentId || !map[parentId]) {
      roots.push(node)
    } else {
      const rootId = findRootId(node.id)
      node.reply_to = map[parentId]
      if (rootId !== node.id && map[rootId]) {
        map[rootId].children!.push(node)
      }
    }
  }

  roots.forEach((root) => {
    if (root.children && root.children.length > 0) {
      root.children.sort(
        (a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
      )
    }
  })

  return roots
}
