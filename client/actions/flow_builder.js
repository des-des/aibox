import {
  PUSH_NODE,
  PUSH_SPLIT,
  PUSH_MERGE
} from '../action_types.js'

export const pushNode = target => ({
  type: PUSH_NODE,
  target
})

export const pushSplit = target => ({
  type: PUSH_SPLIT,
  target
})

export const pushMerge = (target1, target2) => ({
  type: PUSH_MERGE,
  target1,
  target2
})
