import { loadingBarReducer } from 'react-redux-loading-bar';
import { combineReducers } from "redux";
import configuration from "./console/configurationReducer";
import console from "./console/playerReducer";
import effector from "./console/effectorReducer";
import mastering from "./console/masteringReducer";
import mixer from "./console/mixerReducer";
import control from "./control/controlReducer";
import playList from "./console/playlist/playlistReducer";
import recorder from "./console/recorder/recorderReducer";
import search from "./search/searchReducer";
import layout from "./layout/layoutReducer";
import logger from "./logger/loggerReducer";
import profile from "./profile/profileReducer";
import records from "./records/recordsReducer";
import user from "./user/userReducer";
import notifier from "./notifier/notifier";

export default combineReducers({
    notifier,
    logger,
    search,
    console, 
    playList,
    mixer,
    effector,
    configuration,
    mastering,
    control,
    recorder,
    //------
    records,
    //--------------
    user,
    profile,
    //-----------------
    loadingBar: loadingBarReducer,
    layout
})