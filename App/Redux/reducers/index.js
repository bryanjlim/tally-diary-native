import { combineReducers } from "redux";
import preferences from "./preferences";
import entries from "./entries";
import authentication from "./authentication";

export default combineReducers({ entries, preferences, authentication });