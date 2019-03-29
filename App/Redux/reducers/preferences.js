import { UPDATE_PREFERENCES } from "../actionTypes";

const initialState = { };

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PREFERENCES: {
      const { preferences } = action.payload;
      return preferences;
    }
    default:
      return state;
  }
}
