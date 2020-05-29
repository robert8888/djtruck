// ---------- PlayList---------------------

const ACTIONS = {

    PL_ROOT_REQUEST: "Call to api for root dir content",
    PL_LOAD_DIR_REQUEST: "call to api for dir conent",
    PL_PUSH_DIR_CONTENT: "Push  director contetn loaded  from api",
    PL_CREATE_DIR_REQEST: "Call to api and create dir",
    PL_CREATE_DIR: "Create dir in current",
    PL_TOGGLE_DIR_REQUEST: "If is not loade load and then open",
    PL_TOGGLE_DIR: "Open if is closed an vice versa by path",

    PL_CREATE_PLAYLIST_REQUEST: "Call to api to create playlist in current selected dir of name",
    PL_CREATE_PLAYLIST: "Create play list in current selected dir of name",
    PL_LOAD_PLAYLIST_REQUEST: "Call to api to get current playlist content",
    PL_OPEN_CURRENT_PLAY_LIST: "Open/explore current play list",
    PL_SET_PLAYLIST_CONTENT: "Settinng content of current playlist from api",
    PL_RESET_CURRENT_PLAYLIST_CONTETN: "Resetting playlist content after changing position from unsuccess dragging",

    PL_SET_SELECTION: "Set current selected dir and playlist if is selected playlist",
    PL_RENAME_SELECTED_REQUEST: "Call to api to rename current selected",
    PL_RENAME_SELECTED: "Rename current selected element",
    PL_MOVE_TO_REQUEST: "Call to api and move element from pathFrom to pathTo",
    PL_MOVE_TO: "Move element of pathFrom to pathTo (from drag and drop)",
    PL_DELETE_SELECTED_REQUEST: "Call to api and delete current selected element",
    PL_DELETE_SELECTED: "Remove current selected element",

    PL_PUSH_TRACK_REQUEST: "Call to api and add track to current playlist",
    PL_PUSH_TRACK: "Push track on end of list",
    PL_COPY_TRACK_TO_LIST: "Add track to list (from drag and drop)",
    PL_UPDATE_TRACK_POSITION_REQUST: "Update track position in database after swaping",
    PL_SWAP_TRACK_ON_CURRENT: "Swap elements on current play list",
    PL_INIT_CALC_BPM: "Start calculating bpm for track", 
    PL_SET_BPM_AND_OFFSET: "Update Bpm and Offset track on playlist",
    PL_DELETE_TRACK_REQUEST: "Call to api to delete track of given id from current plalist",
    PL_DELETE_TRACK: "Remove track of given index from current playlist",

}
export { ACTIONS as PLAY_LIST_ACTIONS }

//------------- managing dir actions

export function rootDirRequest() {
    return { type: ACTIONS.PL_ROOT_REQUEST }
}

export function loadDirRequest(path, open) {
    return { type: ACTIONS.PL_LOAD_DIR_REQUEST, path, open }
}

export function pushDirContent(dirContent, isRoot, path, open) {
    return { type: ACTIONS.PL_PUSH_DIR_CONTENT, dirContent, isRoot, path, open }
}

export function createDirRequest(name) {
    return { type: ACTIONS.PL_CREATE_DIR_REQEST, name }
}

export function createDir(name, id, renameMode) {
    return { type: ACTIONS.PL_CREATE_DIR, name, id, renameMode }
}

export function toggleDirRequest(path) {
    return { type: ACTIONS.PL_TOGGLE_DIR_REQUEST, path }
}

export function toggleDir(path) {
    return { type: ACTIONS.PL_TOGGLE_DIR, path }
}

//------------- managing playlist actions

export function createPlaylistRequest(name) {
    return { type: ACTIONS.PL_CREATE_PLAYLIST_REQUEST, name }
}

export function createPlaylist(name, id, renameMode, setCurrent) {
    return { type: ACTIONS.PL_CREATE_PLAYLIST, name, id, renameMode, setCurrent }
}

export function openPlaylistRequest(path) {
    return { type: ACTIONS.PL_LOAD_PLAYLIST_REQUEST, path }
}

export function openCurrentPlaylist() {
    return { type: ACTIONS.PL_OPEN_CURRENT_PLAY_LIST }
}

export function setPlaylistContent(playlistContent, path) {
    return { type: ACTIONS.PL_SET_PLAYLIST_CONTENT, playlistContent, path }
}

export function resetCurrentPlaylistContent(list) {
    return { type: ACTIONS.PL_RESET_CURRENT_PLAYLIST_CONTETN, list }
}
//-------------- elemenet selction and change element hierarych actions

export function setSelection(path) {
    return { type: ACTIONS.PL_SET_SELECTION, path }
}

export function renameSelectedRequest(name) {
    return { type: ACTIONS.PL_RENAME_SELECTED_REQUEST, name }
}

export function renameSelected(name) {
    return { type: ACTIONS.PL_RENAME_SELECTED, name }
}

export function moveToRequest(pathFrom, pathTo) {
    return { type: ACTIONS.PL_MOVE_TO_REQUEST, pathFrom, pathTo }
}

export function moveTo(pathFrom, pathTo) {
    return { type: ACTIONS.PL_MOVE_TO, pathFrom, pathTo }
}

export function deleteSelectedRequest() {
    return { type: ACTIONS.PL_DELETE_SELECTED_REQUEST }
}

export function deleteSelected() {
    return { type: ACTIONS.PL_DELETE_SELECTED }
}

//-------------- Track actions

export function pushTrackToListRequest(track, playlist) {
    return { type: ACTIONS.PL_PUSH_TRACK_REQUEST, track, playlist }
}

export function pushTrackToList(track, playlist) {
    return { type: ACTIONS.PL_PUSH_TRACK, track, playlist }
}

export function copyTrackToList(track, path) {
    return { type: ACTIONS.PL_COPY_TRACK_TO_LIST, track, path }
}

export function updateTrackPositionRequest(tracksPositions) {
    return { type: ACTIONS.PL_UPDATE_TRACK_POSITION_REQUST, tracksPositions }
}

export function swapTrackOnList(from, to) {
    return { type: ACTIONS.PL_SWAP_TRACK_ON_CURRENT, from, to }
}

export function startCalcBpm(track, playlist) {
    return { type: ACTIONS.PL_INIT_CALC_BPM, track, playlist }
}

export function setBpmAndOffset(id, playlist, bpm, offset) {
    return { type: ACTIONS.PL_SET_BPM_AND_OFFSET, id, playlist, bpm, offset, }
}

export function deleteTrackRequest(index, id) {
    return { type: ACTIONS.PL_DELETE_TRACK_REQUEST, index, id }
}

export function deleteTrack(index) {
    return { type: ACTIONS.PL_DELETE_TRACK, index }
}

