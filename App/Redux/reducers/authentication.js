import { SET_AUTHENTICATION } from "../actionTypes";

const initialState = {
  accessToken: "",
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_AUTHENTICATION: {
      const { accessToken } = action.payload;
      return {
        accessToken: accessToken,
      };
    }
    default:
      return state;
  }
}
