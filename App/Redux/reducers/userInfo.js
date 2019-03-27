import { SET_USER_INFO } from "../actionTypes";

const initialState = {
  accessToken: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_INFO: {
      const { userInfo } = action.payload;
      return {
        userInfo: userInfo,
      };
    }
    default: {
      return state;
    }
  }
}
