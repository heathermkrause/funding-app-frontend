import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import {
    Card,
    Form,
    Row,
    Col,
    Modal,
    Button,
    Popover,
    OverlayTrigger
} from 'react-bootstrap';
import {
    EditButton,
    ConfirmButton,
    CancelButton,
    DeleteButton,
    AddButton
} from '../../../components/Buttons/Buttons';
import {
    projectLoadRequest,
    updateProjectField,
    projectSaveRequest,
    loadNewProject,
    projectListRequest,
    projectDeleteRequest
} from './redux/actions';

import { Icon } from '../../../components/Icon';

const Project = () => {

    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const currentUser = useSelector(state => state.auth.currentUser);
    const projects = useSelector(
        state => state.app.projectState.projects.list,
    );
    const project = useSelector(
        state => state.app.projectState.project.data,
    );

    useEffect(() => {
        dispatch(projectListRequest());
    }, [currentUser, dispatch]);

    const onAddProject = () => {
        setEditMode(true);
        dispatch(loadNewProject());
    }
    const onSelectProject = e => {
        dispatch(projectLoadRequest(e.target.value));
    }
    const onEditProject = () => {
        dispatch(projectLoadRequest(project._id));
        setEditMode(true);
    }
    const onConfirmProject = () => {
        dispatch(projectSaveRequest())
        setEditMode(false);
    }

    const onUpdateField = (field, index) => event => {
        dispatch(updateProjectField(field, event.target.value, index));
    };

    const onCancelProject = () => {
        setEditMode(false);
    }
    const onDeleteProject = () => {
        setShowConfirm(true)
    }
    const handleCancel = () => {
        setShowConfirm(false);
    }
    const handleConfirm = () => {
        dispatch(projectDeleteRequest(project._id));
        setShowConfirm(false);
        dispatch(projectListRequest());
    }

    const renderConfirmDialog = () => {
        return (
            <Modal show={showConfirm} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleting the Stakeholder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The connections and stakeholders in this Project will be also removed. </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleConfirm}>
                        Remove
                    </Button>
                    <Button variant="primary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <Card className="bg-light mt-5 px-5 position-relative">
            <Card.Body>
                <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={
                        <Popover id={`popover-positioned-buttom`}>
                            <Popover.Title as="h3">Project Name!</Popover.Title>
                            <Popover.Content>
                                You can create and update a project.
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

                <Form.Group as={Row} >
                    <Form.Label column lg="3" className="barlow-black-text">
                        Project Name:
                    </Form.Label>
                    {editMode
                        ?
                        <>
                            <Col lg="7" className="pt-2">
                                <Form.Control
                                    type="text"
                                    className="barlow-light-text"
                                    value={get(project, 'name', '')}
                                    onChange={onUpdateField('name')}
                                    placeholder="Project Name"
                                    required
                                />
                            </Col>
                            <Col lg="2" className="pt-2 text-center">
                                <ConfirmButton onClick={onConfirmProject} />
                                <CancelButton onClick={onCancelProject} />
                            </Col>
                        </>
                        :
                        <>
                            <Col lg="7" className="pt-2">
                                <select
                                    className="custom-select custom-select-sm barlow-light-text"
                                    value={project._id}
                                    onChange={(e) => onSelectProject(e)}
                                >
                                    {projects.map(project => (
                                        <option key={project._id} value={project._id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                            <Col lg="2" className="pt-2 text-center">
                                <EditButton onClick={()=>onEditProject()} />
                                <DeleteButton onClick={()=>onDeleteProject()} />
                                <AddButton onClick={()=>onAddProject()} />
                            </Col>
                        </>
                    }
                </Form.Group>
                {renderConfirmDialog()}
            </Card.Body>
        </Card>
    )
}

export { Project };