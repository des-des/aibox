import {
  PUSH_NODE,
  PUSH_SPLIT
} from '../action_types.js'

export const pushNode = target => ({
  type: PUSH_NODE,
  target
})

export const pushSplit = target => ({
  type: PUSH_SPLIT,
  target
})
