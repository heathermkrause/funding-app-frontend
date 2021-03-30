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
    projectDeleteRequest,
} from './redux/actions';

import { Icon } from '../../../components/Icon';

import QuestionImg from '../../../assets/question.svg';
import FileImg from '../../../assets/file.svg';

const Project = () => {

    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const currentUser = useSelector(state => state.auth.currentUser);
    const projects = useSelector(
        state => state.app.projectState.projects.list,
    );
    const selected_project_id = useSelector(
        state => state.app.projectState.projects.selected_project_id,
    );
    const project = useSelector(
        state => state.app.projectState.project.data,
    );

    const project_id = useSelector(
        state => state.app.projectState.project.id,
    );
    
    useEffect(() => {
        dispatch(projectListRequest());
        //console.log(project, localStorage.getItem('current_project_id'));
        //dispatch(projectLoadRequest(localStorage.getItem('current_project_id')));
    }, [currentUser, dispatch]);

    // useEffect(() => {
    //     if(localStorage.getItem('current_project_id') != project._id && project._id !== undefined) {
    //         console.log('call project', project);
    //         localStorage.setItem('current_project_id', project._id)
    //         dispatch(projectLoadRequest(project._id));
    //     }
    // }, [project, dispatch]);

    const onAddProject = () => {
        setEditMode(true);
        dispatch(loadNewProject());
    }
    const onSelectProject = e => {
        localStorage.setItem('current_project_id', e.target.value);
        dispatch(projectLoadRequest(e.target.value));
    }
    const onEditProject = () => {
        dispatch(projectLoadRequest(project._id));
        setEditMode(true);
    }
    const onConfirmProject = () => {
        dispatch(projectSaveRequest())
        setEditMode(false);
        setTimeout(function(){ dispatch(projectListRequest()); }, 600);
        
    }

    const onUpdateField = (field, index) => event => {
        dispatch(updateProjectField(field, event.target.value, index));
    };

    const onCancelProject = () => {
        setEditMode(false);
        dispatch(projectListRequest());
    }
    const onDeleteProject = () => {
        setShowConfirm(true)
    }
    const handleCancel = () => {
        setShowConfirm(false);
        dispatch(projectListRequest());
    }
    const handleConfirmDelete = () => {
        dispatch(projectDeleteRequest(project._id));
        setShowConfirm(false);
        //dispatch(projectListRequest());
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
                    <Button variant="danger" onClick={handleConfirmDelete}>
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
                <div className="flex-item-between mt10">
                    <div className="flex-item header-title">
                        <img src={FileImg} alt="" className="file-img"/>
                        <p>Project Name</p>
                    </div>                    
                    <OverlayTrigger
                        trigger="click"
                        placement="bottom"
                        overlay={
                            <Popover id={`popover-positioned-buttom`}>
                                <Popover.Title as="h3">Project Name!</Popover.Title>
                                <Popover.Content>
                                Here you can create, update, or delete projects.
                                </Popover.Content>
                            </Popover>
                        }
                    >
                        <a
                            href="#"
                            className="pull-right"
                            style={{
                                "top": "15px",
                                "right": "20px",
                                "fontSize": "22px",
                                "color": "#312975"
                            }}
                        >
                            <img src={QuestionImg} alt="" className="quiz"/>
                        </a>
                    </OverlayTrigger>
                </div>

                <hr/>
                <Form.Group as={Row} >                    
                    {editMode
                        ?
                        <>
                            <Col lg="12" xs="12">
                                <Form.Control
                                    type="text"
                                    className="barlow-light-text"
                                    value={get(project, 'name', '')}
                                    onChange={onUpdateField('name')}
                                    placeholder="Project Name"
                                    required
                                />
                            </Col>
                            <Col lg="12" xs="12" className="pt-4 flex-end">
                                <ConfirmButton onClick={onConfirmProject} />
                                <CancelButton onClick={onCancelProject} />
                            </Col>
                        </>
                        :
                        <>
                            <Col lg="12" xs="12">
                                <select
                                    className="custom-select custom-select-md barlow-light-text"
                                    value={project_id}
                                    onChange={(e) => onSelectProject(e)}
                                >
                                    {projects.map(project => (
                                        <option key={project._id} value={project._id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>
                            </Col>
                            <Col lg="12" xs="12" className="pt-4 flex-end">
                                { project_id && 
                                    <EditButton onClick={()=>onEditProject()} /> 
                                }
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