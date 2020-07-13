export const SET_STATE = (state, data) => {
  Object.keys(data).forEach((key) => {
    state[key] = data[key];
  });
  // state = Object.assign({}, state, data)
};

export const SET_SCHEMA_MESSAGE = (state, messages) => {
  state.messages = messages;
};
