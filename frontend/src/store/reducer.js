import * as actionTypes from './actionTypes';

export const initState = {
  userAccount: "",
  nonce: "",
  authToken: ""
};

export const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      const { userAccount } = action.payload;
      return { ...state, userAccount }
    case actionTypes.SET_NONCE:
      const { nonce } = action.payload;
      return { ...state, nonce }
    case actionTypes.SET_AUTH_TOKEN:
      const { authToken } = action.payload;
      return { ...state, authToken }
    default:
      return state
  }
}
