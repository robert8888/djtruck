import React, {useEffect, useState, useMemo, useCallback, useRef, useContext} from "react";
import {connect} from "react-redux";
import {
    setMappingState,
    setMidiPort,
    reqControlProfile,
    reqControlProfileList,
    reqDeleteControlProfile,
    reqCreateControlProfile,
    reqUpdateControlProfile,
} from "actions";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCogs} from "@fortawesome/free-solid-svg-icons"
import {Button, Form} from "react-bootstrap";
import Modal from "./../../../../common/components/Modal/Modal";
import UUID from "uuidjs";
import classNames from "classnames";
import "./control-menu.scss";
import LayoutContext from "../../../../common/Layout/LayoutContext";

const mapStateToProps = state =>({
    currentPort : state.control.port,

    currentMidiProfileId : state.control.currentMidiProfileId,
    currentKbdProfileId: state.control.currentKbdProfileId,

    profilesList : state.control.profileList,

    mappingMode: state.control.mapping,
    userId: state.user.id,
})

const mapDispatchToProps = dispatch => ({
    updatePort : (port) => dispatch(setMidiPort(port)),
    setMappingMode: (value) => dispatch(setMappingState(value)),

    reqLoadProfile : (id) => dispatch(reqControlProfile(id)),
    reqProfileList : () => dispatch(reqControlProfileList()),
    reqCreateProfile: (name, profileType) => dispatch(reqCreateControlProfile(name, profileType)),
    reqUpdateProfile: profile => dispatch(reqUpdateControlProfile(profile)),
    reqDeleteProfile: profile => dispatch(reqDeleteControlProfile(profile)),
})

const ControlMenu = ({
    userId,
    currentPort, updatePort,

    mappingMode, setMappingMode,
    profilesList, reqProfileList,
    currentMidiProfileId, currentKbdProfileId,
    reqLoadProfile, reqCreateProfile, reqUpdateProfile, reqDeleteProfile,
     }) => {
    const {mode, screen} = useContext(LayoutContext);
    const [midiDisabled, setMidiDisabled] = useState(false);
    const [modalState, setModalState] = useState(["hidden", "visible"][0]);
    const [midiIns, setMidiIns] = useState(null);
    const [collapsed, setCollapsed] = useState(true);
    const [modalType, setModalType] = useState("create");
    const profileNameInput = useRef();
    const profileType = useRef();


    const midiProfiles = useMemo(()=>
        profilesList.filter(profile => profile.type === "midi")
    ,[profilesList])

    const kbdProfiles = useMemo(()=>
        profilesList.filter(profile => profile.type === "kbd")
    ,[profilesList])

    useEffect(() => {
        if(!userId) return;
        reqProfileList();
    }, [reqProfileList, userId])

    useEffect(()=>{
        if(typeof navigator.requestMIDIAccess !== "function") return;

        navigator.requestMIDIAccess({sysex:true})
            .then((webMidi)=>{
                const ports = [];
                webMidi.inputs.forEach( port => ports.push(port))
                setMidiIns(ports);
            }, () => {
                setMidiDisabled(true)
            });
    }, [setMidiDisabled, setMidiIns])

    const setPort = useCallback( port => {
        updatePort(port)
    }, [updatePort])

    const ports = useMemo(()=>{
        if(!midiIns || (midiIns && !midiIns.length)) return null;
        return midiIns.map( port => {
            const classes = classNames(
                "control__nav__item", {
                    "control__nav__item--current": port.id === currentPort?.id,
                }
            )
            return (
                <li key={UUID.genV1()}  className={classes} onClick={setPort.bind(null, port)}>
                    {port.name}
                </li>
            )
        })
    }, [midiIns, setPort, currentPort])

    const deleteProfile = useCallback((type, e) => {
        e.stopPropagation();
        const id = type === "midi" ? currentMidiProfileId : currentKbdProfileId;
        const profile = profilesList.find(profile => profile.id === id);
        reqDeleteProfile(profile);
    }, [reqDeleteProfile, profilesList, currentKbdProfileId, currentMidiProfileId]);

    const modalConfirm = useCallback(()=>{
        const name = profileNameInput.current.value;
        const type = profileType.current;
        const mode = modalType
        if(mode === "create"){
            reqCreateProfile(name, type)
        } else if(mode === "edit") {
            const id = type === "midi" ? currentMidiProfileId : currentKbdProfileId;
            reqUpdateProfile({name, id})
        }

        setModalState("hidden")
    }, [reqUpdateProfile, profileNameInput, modalType,currentMidiProfileId, currentKbdProfileId,
             profileType, reqCreateProfile, setModalState])

    const menuCrudItems = useCallback( type => {
        const items = [];
        items.push((
            <li key={"control-nav-item-create"}
                className={"control__nav__item control__nav__item--create"}
                onClick={(e) => {
                    e.stopPropagation();
                    setModalState("visible");
                    profileType.current = type;
                    setModalType("create");
                }}>
                    Create new
            </li>
        ))
        if((type === "midi" && !midiProfiles.length)
            ||(type === "kbd" && !kbdProfiles.length)){
            return items;
        }
        items.push((
            <li key={"control-nav-item-edit"}
                className={"control__nav__item control__nav__item--edit" +
                          (mappingMode === type ? "control__nav__item-active" : "")}
                onClick={(e)=>{
                    e.stopPropagation();
                    setMappingMode(mappingMode === type ? null : type)
                }} >
                {((mappingMode === type) ? "Finish " : "") + "Edit"}

            </li>
        ))
        items.push((
            <li key={"control-nav-item-rename"}
                className={"control__nav__item control__nav__item--rename"}
                onClick={(e) => {
                    e.stopPropagation();
                    setModalState("visible");
                    profileNameInput.current.value = profilesList.find( profile =>
                           (type === "midi" && profile.id === currentMidiProfileId)
                        || (type === "kbd" && profile.id === currentKbdProfileId)
                    )?.name || ""
                    profileType.current = type;
                    setModalType("edit");
                }}>
                    Rename current
            </li>
        ))
        items.push((
            <li key={"control-nav-item-delete"} className={"control__nav__item control__nav__item--delete"}
                onClick={deleteProfile.bind(null, type)}>
                    Delete current
            </li>
        ))
        return items;
    }, [setMappingMode, mappingMode, deleteProfile, setModalState, kbdProfiles.length, midiProfiles.length,
        currentMidiProfileId, currentKbdProfileId, profilesList, setModalType]);

    const profilesMenuItems = useCallback((type)=>{
        const profiles = type === "midi" ? midiProfiles : kbdProfiles;
        const currentId = type === "midi" ? currentMidiProfileId : currentKbdProfileId;
        const items = (profiles && profiles.length && profiles.map( profile => {
            const classes = classNames(
                "control__nav__item", {
                    "control__nav__item--current": profile.id === currentId,
                }
            )
            return (
                <li key={UUID.genV1()}  className={classes}
                    onClick={
                        reqLoadProfile.bind(null, profile.id)
                    }>
                        {profile.name}
                </li>
            )
        })) || [];
        items.push((<li key={"control-nav-item-spacer-1"} className={"control__nav__item control__nav__item--spacer"}/>))

        return items.concat(menuCrudItems(type));
    }, [midiProfiles, currentMidiProfileId,
             currentKbdProfileId, kbdProfiles, reqLoadProfile, menuCrudItems])

    const midiProfilesMenuItems = useMemo(() => profilesMenuItems("midi"), [profilesMenuItems])

    const kbdProfilesMenuItems = useMemo(() => profilesMenuItems("kbd"), [profilesMenuItems])


    return (
        <div className={`control component control--${mode} control--${screen}`}>
            <div className="component__label">CFG</div>
            <nav className={"control__nav__container"} onMouseLeave={setCollapsed.bind(null, true)}>
                <Button className={"control__nav__button "} onClick={setCollapsed.bind(null, false)}>
                    <FontAwesomeIcon icon={faCogs}/>
                </Button>
                <ul className={"control__nav control__nav--" + (collapsed ? "collapsed" : "expanded")}>
                    <li className={"control__nav__item" + ((midiDisabled) ? " control__nav__item--disabled" : "")}>
                        Midi ports
                        <ul className={"control__nav control__nav__sub"}>
                            {ports}
                        </ul>
                    </li>

                    <li className={"control__nav__item"}>
                        Midi profiles
                        <ul className={"control__nav control__nav__sub"}>
                            {midiProfilesMenuItems}
                        </ul>
                    </li>
                    <li className={"control__nav__item"}>
                        Keyboard profiles
                        <ul className={"control__nav control__nav__sub"}>
                            {kbdProfilesMenuItems}
                        </ul>
                    </li>
                </ul>
            </nav>


            <Modal show={(modalState === "visible")}
                   title={"Profile name"}
                   onHide={setModalState.bind(null,"hidden")}>
                <div className={"modal__content"}>
                    <Form.Group>
                        <Form.Control
                            name={"profile-name"}
                            ref={profileNameInput}
                            className={"modal__content__profile-name"}
                            type={"text"}/>
                    </Form.Group>
                    <Button
                        onClick={modalConfirm}
                        className={"modal__content__confirm-btn"}>
                        {( modalType === "create" ? "Create" : "Update") +  " profile"}
                    </Button>
                </div>
            </Modal>
        </div>
    )
}



export default connect(mapStateToProps, mapDispatchToProps)(ControlMenu);