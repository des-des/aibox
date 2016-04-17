import {
  PUSH_NODE
} from '../action_types.js'

export const pushNode = target => ({
  type: PUSH_NODE,
  target
})
