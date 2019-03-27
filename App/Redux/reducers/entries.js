import { UPDATE_ENTRIES } from "../actionTypes";

const initialState = {
  entries: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ENTRIES: {
      const { entries } = action.payload;
      return {
        entries: entries,
      };
    }
    default:
      return state;
  }
}
