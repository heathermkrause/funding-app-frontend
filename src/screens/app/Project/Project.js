import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'lodash';
import {
    Card,
    Form,
    Row,
    Col
} from 'react-bootstrap';
import {
    EditButton,
    ConfirmButton,
    CancelButton
} from '../../../components/Buttons/Buttons';
import {
    projectLoadRequest,
    updateProjectField,
    projectSaveRequest,
    loadNewProject,
    projectListRequest
} from './redux/actions';

import { Icon } from '../../../components/Icon';

const Project  = () => {

    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);

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

    const onUpdateField = (field, index) => event => {
        dispatch(updateProjectField(field, event.target.value, index));
    };

    const onEditProject = () => {
        if (projects[0]) {
            dispatch(projectLoadRequest(projects[0]._id));
        } else {
            dispatch(loadNewProject());
        }
        setEditMode(true);
    }

    const onConfirmProject = () => {
        dispatch(projectSaveRequest())
        setEditMode(false);
        dispatch(projectListRequest());
    }

    const onCancelProject = () => {
        setEditMode(false);
    }

    return (
        <Card className="bg-light mt-5 px-5 position-relative">
            <Card.Body>

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

                <Form.Group as={Row} >
                    <Form.Label column lg="3">
                        Project Name:
                    </Form.Label>
                    {editMode
                        ?
                        <>
                            <Col lg="7" className="pt-2">
                                <Form.Control
                                    type="text"
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
                            <Col lg="7">
                                <h3>{get(projects, [0, 'name'], '')}</h3>
                            </Col>
                            <Col lg="2" className="pt-2 text-center">
                                <EditButton onClick={onEditProject} />
                            </Col>
                        </>
                    }
                </Form.Group>
            </Card.Body>
        </Card>
    )
}

export { Project };