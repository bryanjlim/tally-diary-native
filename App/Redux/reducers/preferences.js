import { UPDATE_PREFERENCES } from "../actionTypes";

const initialState = {
  preferences: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PREFERENCES: {
      const { preferences } = action.payload;
      return {
        preferences: preferences,
      };
    }
    default:
      return state;
  }
}
