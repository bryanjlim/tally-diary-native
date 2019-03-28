import { SET_USER_INFO, SET_PREFERENCES_ID, SET_ENTRIES_ID } from "../actionTypes";

const initialState = {
  userInfo: null,
  preferencesId: null,
  entriesId: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_INFO: {
      const { userInfo } = action.payload;
      return {
        userInfo: userInfo,
        preferencesId: state.preferencesId,
        entriesId: state.entriesId,
      };
    }
    case SET_PREFERENCES_ID: {
      const { preferencesId } = action.payload;
      return {
        userInfo: state.userInfo,
        preferencesId: preferencesId,
        entriesId: state.entriesId
      };
    }
    case SET_ENTRIES_ID: {
      const { entriesId } = action.payload;
      return {
        userInfo: state.userInfo,
        preferencesId: state.preferencesId,
        entriesId: entriesId,
      };
    }
    default: {
      return state;
    }
  }
}
