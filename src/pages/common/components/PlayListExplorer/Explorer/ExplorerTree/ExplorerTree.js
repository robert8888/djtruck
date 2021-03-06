import React, { useCallback, useState, Fragment, useEffect} from "react";
import UUID from "uuidjs";
import { connect } from "react-redux";
import {
    toggleDirRequest,
    setSelection,
    openPlaylistRequest,
    renameSelectedRequest,
    deleteSelectedRequest,
    createDirRequest,
    createPlaylistRequest, preFetchPlaylistContent
} from "actions"
import { isEmpty, sortObj } from "utils/objects/helpers";
import { useDoubleClick } from "./useDoubleClick";
import RenameInput from "./RenameInput/RenameInput";
import DirElement from "./DirElement/DirElement";
import FileElement from "./FileElement/FileElement";
import {Item, Menu, Separator, useContextMenu} from "react-contexify";
import _get from "lodash/get";
import "./explorer-tree.scss";

const ExplorerTree =({
    toggleDir,
    setSelection,
    renameMode,
    renameSelected,
    openSelected,
    createPlaylist,
    createDir,
    deleteSelected,
    prefetchPlaylist,
    currentSelection,
    currentSelectedType,
    root }) => {
    const { show } = useContextMenu({id: "EXPLORER"})
    const [_renameMode, setRenameMode] = useState(false);


    useEffect(() => {
        setRenameMode(renameMode)
    }, [renameMode, setRenameMode])

    const renameInput = useCallback(name => {
        return (
            <RenameInput name={name} onChange={value => {
                renameSelected(value);
                setRenameMode(false)
            }} />
        )
    }, [renameSelected, setRenameMode])

    const [dirClickHandler] = useDoubleClick({
        clickHandler: (path) => {
            if (!_renameMode) {
                setSelection(path)
            }
        },
        doubleClickHandler: path => toggleDir(path),
    })

    const getDirElement = useCallback(({ ...params }) => {
        const fullPath = [...params.path, params.name]
        return (
            <DirElement
                key={UUID.genV1()}
                {...params}
                renameMode={_renameMode}
                renameInput={renameInput}
                onClick={dirClickHandler.bind(null, fullPath)}
                buttonClick={toggleDir.bind(null, fullPath)}
                onContextMenu={setSelection.bind(null, fullPath)}
            />
        )
    }, [_renameMode, renameInput, dirClickHandler, setSelection, toggleDir])

    const [fileClickHandler] = useDoubleClick({
        clickHandler: (path) => {
            if (!_renameMode) {
                setSelection(path)
            }
        },
        doubleClickHandler: openSelected
    })

    const getFileElement = useCallback((name, path) => {
        const fullPath = [...path, name]
        return (
            <FileElement
                key={UUID.genV1()}
                name={name}
                path={path}
                renameMode={_renameMode}
                renameInput={renameInput}
                onClick={fileClickHandler.bind(null, fullPath)}
                buttonClick={toggleDir.bind(null, fullPath)}
                onContextMenu={setSelection.bind(null, fullPath)}
            />
        )
    }, [_renameMode, renameInput, fileClickHandler, toggleDir, setSelection])

    let renderDir;
    const renderDirElements = useCallback((name, content, path) => {
        content = sortObj(content);
        if (content._type === "playlist") {//} instanceof Array) {
            return getFileElement(name, path)
        } else {
            if (content._open === true) {
                return (
                    <Fragment key={UUID.genV1()}>
                        {getDirElement({ name, path, open: true })}
                        {renderDir(content, [...path, name])}
                    </Fragment>
                )
            } else {
                if (isEmpty(content)) {
                    return getDirElement({ name, path, open: false, empty: true })
                }
                return getDirElement({ name, path, open: false })
            }
        }
    }, [getDirElement, getFileElement, renderDir])

    renderDir = useCallback((dir, path) => {
        return (
            <ul className="list-dir dir-content" key={UUID.generate()}>
                {
                    Object.entries(dir).map(([name, content]) => {
                        if (name.startsWith("_")) {
                            return null;
                        }
                        return renderDirElements(name, content, path);
                    })
                }
            </ul>
        )
    }, [renderDirElements])


    return (
        <>
            <div id="EXPLORER" onContextMenu={show}>
                <div className="explorer-tree" onClick={setSelection.bind(null, ["root"])}>
                    {renderDir(root, ['root'])}
                </div>
            </div>
            <Menu id="EXPLORER">
                <Item onClick={createPlaylist.bind(null)}>Add Playlist</Item>
                <Item onClick={createDir.bind(null)}>Add folder</Item>
                { currentSelection.length > 1 &&
                    <>
                    <Item onClick={setRenameMode.bind(null, true)}>Rename</Item>
                    <Item onClick={deleteSelected.bind(null)}>Delete</Item>
                    </>
                }
                {currentSelectedType === "playlist" &&
                    <>
                    <Separator/>
                    <Item onClick={prefetchPlaylist.bind(null)}>Cache playlist</Item>
                    </>
                }
            </Menu>
        </>
    )
}

const mapStateToProps = state => ({
    root: state.playList.root,
    currentSelection: state.playList.currentSelection,
    renameMode: state.playList.renameMode,
    currentSelectedType: _get(state.playList, state.playList.currentSelection)?._type
})

const mapDispatchToProps = dispatch => ({
    toggleDir: path => dispatch(toggleDirRequest(path)),//
    setSelection: path => dispatch(setSelection(path)),
    openSelected: path => dispatch(openPlaylistRequest(path)),//to request
    renameSelected: newName => dispatch(renameSelectedRequest(newName)),//
    deleteSelected: () => dispatch(deleteSelectedRequest()),//
    createDir: () => dispatch(createDirRequest(null)),//
    createPlaylist: () => dispatch(createPlaylistRequest(null)),//
    prefetchPlaylist: () => dispatch(preFetchPlaylistContent())
})

export default connect(mapStateToProps, mapDispatchToProps)(ExplorerTree);