import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { reqUpdateRec, reqDeleteRec, setRecDeleteStatus } from "./../../../../actions";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import { getApi } from "./.././../../../apis/apiProvider";
import { Form, Button } from "react-bootstrap";
import IconBar from "./../IconBar/IconBar";
import "./record-details.scss";
import useAutoHeightTextarea from "../../Hooks/useAutoHeightTextarea";

const RecordDetails = ({ record, userId, requestUpdate, requestDelete, deleteStatus, resetDeleteStatus }) => {
    const getDownloadLink = useMemo(() => getApi('RecordsStore').getDownloadLink, [getApi])
    const history = useHistory();
    const [editMode, setEditMode] = useState(false);
    const [editable, setEditable] = useState(false);

    const [userNickname, setUserNickname] = useState("")
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [generes, setGeneres] = useState([]);

    const descriptionTextArea = useRef();
    const [autoResizeTextArea] = useAutoHeightTextarea();


    const setFromRecord = useCallback((record) => {
        if (record.user.id === userId) {
            setEditable(true);
        }
        setUserNickname(record.user.nickname || "");
        setTitle(record.title || "")
        setDescription(record.description || "")
        setGeneres(record.generes.map(genere => genere.name).join(", ") || []);
    }, [userId,
        setEditable,
        setTitle,
        setDescription,
        setGeneres,
        setUserNickname])

    useEffect(() => {
        if (!record) return;
        setFromRecord(record)
    }, [record, setFromRecord])


    const toggleMode = useCallback(() => {
        const mode = !editMode;
        setEditMode(mode)
        if (!mode) {
            setFromRecord(record)
        }

    }, [record, editMode, setEditMode])

    const updateTitle = useCallback((event) => {
        if (event.target.value.indexOf("_") !== -1) {
            event.target.setCustomValidity(`Using underscore in sets name is 
                not allowed. You can use eg "-". Pleas change name of your record`)
        } else {
            event.target.setCustomValidity('')
        }
        setTitle(event.target.value);
    }, [setTitle])

    const updateDescription = useCallback(event => {

        setDescription(event.target.value)
    }, [setDescription])


    const updateGeneres = useCallback(event => {
        setGeneres(event.target.value)
    }, [setGeneres])

    const updateRecordDetails = useCallback(event => {
        event.preventDefault();
        const title = event.target.elements.title.value;
        const description = event.target.elements.description.value;
        const generes = event.target.elements.generes.value || "";
        const generesArr = generes.split(",").filter(str => str !== "").map(str => str.trim().toLowerCase());
        requestUpdate(record.id, {
            title,
            description,
            generes: generesArr
        })
        setEditMode(false)
    }, [record, setEditMode, requestUpdate])

    const deleteCurrent = useCallback(() => {
        requestDelete(record.id);
    }, [record, requestDelete])

    const downloadCurrent = useCallback(() => {
        const a = document.createElement('a');
        a.href = getDownloadLink(record?.id, record?.title);
        a.setAttribute('download', record?.title);
        a.click();
    }, [record])

    useEffect(() => {
        console.log(deleteStatus)
        if (deleteStatus === "SUCCESS") {
            history.goBack();
            resetDeleteStatus();
        }
    }, [deleteStatus, resetDeleteStatus])

    return (

        <Form className="record-details" onSubmit={updateRecordDetails}>
            {editable && <IconBar className="record-details-icons" items={{
                edit: toggleMode,
                download: downloadCurrent,
                delete: deleteCurrent,

            }} />}
            <Form.Group className="record-title">
                <Form.Label>User: </Form.Label>
                <Form.Control name="user" type="text" value={userNickname} disabled />
            </Form.Group>

            <Form.Group className="record-title">
                <Form.Label>Title: </Form.Label>
                <Form.Control
                    name="title"
                    type="text"
                    value={title}
                    onChange={updateTitle}
                    disabled={!editMode} />
            </Form.Group>
            <Form.Group className="record-description">
                <Form.Label>Description: </Form.Label>
                <Form.Control
                    name="description"
                    as="textarea"
                    ref={ref => descriptionTextArea.current = autoResizeTextArea(ref)}
                    value={description}
                    onChange={updateDescription}
                    disabled={!editMode} />
            </Form.Group>
            <Form.Group className="genere-list">
                <Form.Label>Generes: </Form.Label>
                <Form.Control
                    type="text"
                    name="generes"
                    value={generes}
                    onChange={updateGeneres}
                    pattern="^(?:[A-Za-z&]{1,25}(?:,\s*)?)+$"
                    disabled={!editMode} />
            </Form.Group>
            {editMode && <Button type="submit"> Save </Button>}
        </Form>
    )
}

const mapStateToProps = state => ({
    userId: state.user.dbId,
    deleteStatus: state.records.deleteStatus,
})

const mapDispatchToProps = dispatch => ({
    requestUpdate: (recordId, dataChanges) => dispatch(reqUpdateRec(recordId, dataChanges)),
    requestDelete: (recordId) => dispatch(reqDeleteRec(recordId)),
    resetDeleteStatus: () => dispatch(setRecDeleteStatus("IDLE")),
})

export default connect(mapStateToProps, mapDispatchToProps)(RecordDetails)