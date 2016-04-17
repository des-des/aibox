export default (initState, handlers) => (state = initState, action) => {
  const { type } = action
  return handlers[type] ? handlers[type](state, action) : state
}
