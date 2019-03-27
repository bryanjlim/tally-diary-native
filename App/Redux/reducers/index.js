import { combineReducers } from "redux";
import preferences from "./preferences";
import entries from "./entries";
import userInfo from "./userInfo";

export default combineReducers({ entries, preferences, userInfo });