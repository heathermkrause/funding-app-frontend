import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import findIndex from "lodash/findIndex";
import cloneDeep from "lodash/cloneDeep";
import { Table, Button, Form, Card, OverlayTrigger, Popover, InputGroup } from "react-bootstrap";
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
    const [toggle, setToggle] = useState(false);
    let [connectionDrafts, setConnectionDrafts] = useState([]);
    let [activeColumn, setActiveColumn] = useState('');

    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.currentUser);
    const connections = useSelector(
        (state) => state.app.connectionState.connections.list
    );
    const stakeholders = useSelector(
        (state) => state.app.stakeholderState.stakeholders.list
    );
    const project = useSelector(
        state => state.app.projectState.project.data,
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
                user: currentUser._id,
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
        dispatch(connectionExportRequest(project._id));
    };

    const sortBy = (key, reverse) => {        
        let newConnectoinDrafts = cloneDeep(connectionDrafts);
        if(reverse === true) {
            newConnectoinDrafts.sort(compareBy(key)).reverse();
        } else {
            newConnectoinDrafts.sort(compareBy(key));
        }
        setConnectionDrafts(newConnectoinDrafts);
    }

    const sortByColumn = key => {
        if (activeColumn === key) {
            setToggle(!toggle);
            setActiveColumn(key);
            sortBy(key, toggle);
        } else {
            setActiveColumn(key);
            sortBy(key, false)
        }
    }

    const compareBy = (key) => {
        if(key === 'from' || key === 'to') {
            return function (a, b) {
                if (a[key].name < b[key].name) return -1;
                if (a[key].name > b[key].name) return 1;
                return 0;
            };
        } else {
            return function (a, b) {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
                return 0;
            };
        }
    }

    const handleSearchChange = (e) => {
        const key = e.target.value.toLowerCase();

        let filteredResult = connections.filter(ele => 
            ele.type.toLowerCase().includes(key)
            || ele.from.name.toLowerCase().includes(key) 
            || ele.to.name.toLowerCase().includes(key)
            || ele.note.toLowerCase().includes(key)
        );
        setConnectionDrafts(filteredResult);        
    }

    return (
        <Card className="bg-light mt-5 px-5 py-4">
            <Card.Body>
                <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={
                        <Popover id={`popover-positioned-buttom`}>
                            <Popover.Title as="h3">Connection!</Popover.Title>
                            <Popover.Content>
                                This is the table for the relationship between stakeholders.
                            </Popover.Content>
                        </Popover>
                    }
                >
                    <a
                        href="#"
                        className="position-absolute"
                        style={{
                            "top": "15px",
                            "right": "20px",
                            "fontSize": "22px",
                            "color": "#312975"
                        }}
                    >
                        <Icon name="question-circle" />
                    </a>
                </OverlayTrigger>
                <InputGroup className="w-50">
                    <InputGroup.Prepend>
                        <InputGroup.Text>
                            <Icon name="search" />
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                        type="text"
                        placeholder="Search"
                        name="firstName"
                        onChange={handleSearchChange}
                    />
                </InputGroup>
                <Table striped bordered hover size="sm">
                    <thead className="barlow-black-text">
                        <tr>
                            <th className="text-center w-5"></th>
                            <th className="text-center w-15" onClick={() => sortByColumn('type')}>
                                TYPE
                                {(activeColumn === 'type') ? (toggle) ? " ↓" : " ↑" : ""}
                            </th>
                            <th className="text-center w-20" onClick={() => sortByColumn('from')}>
                                FROM
                                {(activeColumn === 'from') ? (toggle) ? " ↓" : " ↑" : ""}
                            </th>
                            <th className="text-center w-20" onClick={() => sortByColumn('to')}>
                                TO
                                {(activeColumn === 'to') ? (toggle) ? " ↓" : " ↑" : ""}
                            </th>
                            <th className="text-center" onClick={() => sortByColumn('note')}>
                                NOTES
                                {(activeColumn === 'note') ? (toggle) ? " ↓" : " ↑" : ""}
                            </th>
                            <th className="text-center w-15"></th>
                        </tr>
                    </thead>
                    <tbody className="barlow-light-text">
                        {!!connectionDrafts.length &&
                            connectionDrafts.map((connection, index) =>
                                editList.includes(connection._id) ||
                                    connection._id.includes("new") ? (
                                        <tr key={connection._id}>
                                            <td className="content-center">#{index + 1}</td>
                                            <td className="content-center">
                                                <select
                                                    className="custom-select custom-select-sm"
                                                    value={connection.type}
                                                    onChange={(e) =>
                                                        onFieldChange(e, "type", connection._id)
                                                    }
                                                >
                                                    <option value="data" className="c-light-purple">Data</option>
                                                    <option value="funding" className="c-yello">Funding</option>
                                                    <option value="influence" className="c-light-red">InFluence</option>
                                                </select>
                                            </td>
                                            <td className="content-center">
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
                                            <td className="content-center">
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
                                            <td className="content-center">
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
                                            <td className="text-center content-center v-middle">
                                                <ConfirmButton
                                                    onClick={() => onConfirmClick(connection._id)}
                                                />
                                                <CancelButton
                                                    onClick={() => onEditCancelClick(connection._id)}
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={connection._id}>
                                            <td className="text-center v-middle">#{index + 1}</td>
                                            <td className={connection.type === "data" ? 'c-light-purple text-center v-middle' : connection.type === 'funding' ? 'c-yello text-center v-middle' : 'c-light-red text-center v-middle'}>{connection.type}</td>
                                            <td className="text-center v-middle break-word">{connection.from ? connection.from.name : ""}</td>
                                            <td className="text-center v-middle break-word">{connection.to ? connection.to.name : ""}</td>
                                            <td className="text-center v-middle break-word">{connection.note}</td>
                                            <td className="text-center v-middle">
                                                <EditButton onClick={() => onEditClick(connection._id)} />
                                                <DeleteButton
                                                    onClick={() => onDeleteClick(connection._id)}
                                                />
                                            </td>
                                        </tr>
                                    )
                            )}
                    </tbody>
                </Table>
                <Button
                    variant="primary"
                    className="pull-right btn-add"
                    onClick={() => onAddClick(connectionDrafts.length)}
                >
                    +ADD
                </Button>
                <Button
                    variant="info"
                    className="pull-right block mb-3 mr-3 btn-export"
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
