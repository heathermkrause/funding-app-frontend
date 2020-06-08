import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import findIndex from "lodash/findIndex";
import cloneDeep from "lodash/cloneDeep";
import { Table, Button, Form, Card } from "react-bootstrap";
import {
    EditButton,
    ConfirmButton,
    DeleteButton,
    CancelButton,
} from "../../../components/Buttons/Buttons";
import {
    connectionSaveRequest,
    connectionListRequest,
    connectionDeleteRequest,
    connectionExportRequest,
} from "./redux/actions";
import { Icon } from "../../../components/Icon";
import notify from "../../../utils/notify";

const ConnectionTable = (props) => {
    const [editList, setEditList] = useState([]);
    const [skip, setSkip] = useState(0);
    let [connectionDrafts, setConnectionDrafts] = useState([]);

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.currentUser);
    const connections = useSelector(
        (state) => state.app.connectionState.connections.list
    );
    const stakeholders = useSelector(
        (state) => state.app.stakeholderState.stakeholders.list
    );

    useEffect(() => {
        setConnectionDrafts(connections);
    }, [connections.length]);

    // useEffect(() => {
    //     dispatch(connectionListRequest());
    // }, [dispatch]);

    const onEditClick = (id) => {
        setEditList([...editList, id]);
    };

    const onEditCancelClick = (id) => {
        const newEditList = editList.filter((editId) => editId !== id);
        setEditList(newEditList);
        const newConnectionDrafts = connectionDrafts.filter(
            (edit) => edit._id !== id
        );
        setConnectionDrafts(newConnectionDrafts);
    };

    const onDeleteClick = (id) => {
        dispatch(connectionDeleteRequest(id));
        const newConnectionDrafts = connectionDrafts.filter(
            (edit) => edit._id !== id
        );
        setConnectionDrafts(newConnectionDrafts);
    };

    const onAddClick = (index) => {
        setConnectionDrafts([
            ...connectionDrafts,
            {
                _id: "new" + index,
                type: "data",
                from: "",
                to: "",
                note: "",
            },
        ]);
    };

    const onFieldChange = (e, field, id) => {
        const index = findIndex(connectionDrafts, { _id: id });
        let newConnectoinDrafts = cloneDeep(connectionDrafts);
        newConnectoinDrafts[index] = {
            ...newConnectoinDrafts[index],
            [field]: e.target.value,
        };
        setConnectionDrafts(newConnectoinDrafts);
    };

    const onConfirmClick = (id) => {
        const index = findIndex(connectionDrafts, { _id: id });
        const draft = connectionDrafts[index];
        if (!draft.from || !draft.to || !draft.type) {
            return notify("error", "Please fill out all of the fields.");
        }
        if (draft.from === draft.to) {
            return notify("error", "Can not be same stakeholders.");
        }
        dispatch(connectionSaveRequest(connectionDrafts[index]));
        const newEditList = editList.filter((editId) => editId !== id);
        setEditList(newEditList);
    };

    const handleExportCSV = () => {
        dispatch(connectionExportRequest());
    };

    return (
        <Card className="bg-light mt-5 px-5 py-4">
            <Card.Body>
                <a
                    href="#"
                    className="position-absolute"
                    style={{
                        top: "15px",
                        right: "20px",
                        fontSize: "22px",
                        color: "#312975",
                    }}
                >
                    <Icon name="question-circle" />
                </a>

                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th className="w-10">Action</th>
                            <th className="w-5"></th>
                            <th>Type</th>
                            <th className="w-15">From</th>
                            <th className="w-15">To</th>
                            <th>Note</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!!connectionDrafts.length &&
                            connectionDrafts.map((connection, index) =>
                                editList.includes(connection._id) ||
                                    connection._id.includes("new") ? (
                                        <tr key={connection._id}>
                                            <td className="text-center">
                                                <ConfirmButton
                                                    onClick={() => onConfirmClick(connection._id)}
                                                />
                                                <CancelButton
                                                    onClick={() => onEditCancelClick(connection._id)}
                                                />
                                            </td>
                                            <td>#{index + 1}</td>
                                            <td>
                                                <select
                                                    className="custom-select custom-select-sm"
                                                    value={connection.type}
                                                    onChange={(e) =>
                                                        onFieldChange(e, "type", connection._id)
                                                    }
                                                >
                                                    <option value="data">Data</option>
                                                    <option value="funding">Funding</option>
                                                    <option value="influence">InFluence</option>
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className="custom-select custom-select-sm"
                                                    value={connection.from._id}
                                                    onChange={(e) =>
                                                        onFieldChange(e, "from", connection._id)
                                                    }
                                                >
                                                    <option></option>
                                                    {stakeholders.map((sh) => (
                                                        <option key={sh._id} value={sh._id}>
                                                            {sh.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <select
                                                    className="custom-select custom-select-sm"
                                                    value={connection.to._id}
                                                    onChange={(e) => onFieldChange(e, "to", connection._id)}
                                                >
                                                    <option></option>
                                                    {stakeholders.map((sh) => (
                                                        <option key={sh._id} value={sh._id}>
                                                            {sh.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <Form.Control
                                                    type="text"
                                                    value={connection.note}
                                                    placeholder="Note"
                                                    onChange={(e) =>
                                                        onFieldChange(e, "note", connection._id)
                                                    }
                                                    size="sm"
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={connection._id}>
                                            <td className="text-center">
                                                <EditButton onClick={() => onEditClick(connection._id)} />
                                                <DeleteButton
                                                    onClick={() => onDeleteClick(connection._id)}
                                                />
                                            </td>
                                            <td>#{index + 1}</td>
                                            <td>{connection.type}</td>
                                            <td>{connection.from ? connection.from.name : ""}</td>
                                            <td>{connection.to ? connection.to.name : ""}</td>
                                            <td>{connection.note}</td>
                                        </tr>
                                    )
                            )}
                    </tbody>
                </Table>
                <Button
                    variant="primary"
                    className="pull-right"
                    onClick={() => onAddClick(connectionDrafts.length)}
                >
                    +ADD
                </Button>
                <Button
                    variant="info"
                    className="pull-right block mb-3 mr-3"
                    onClick={handleExportCSV}
                >
                    <Icon className="mr-1" name="file"></Icon>
                    EXPORT CSV
                </Button>
            </Card.Body>
        </Card>
    );
};

export { ConnectionTable };
