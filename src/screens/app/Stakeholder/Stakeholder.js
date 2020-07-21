import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Button, 
  Container, 
  Form,
  Row,
  Col,
  Card,
  Modal,
  OverlayTrigger,
  Popover
} from 'react-bootstrap';
import { Table, InputGroup } from "react-bootstrap";
import { Icon } from '../../../components/Icon';
import { ConnectionTable } from '../Connection';
import { Project } from '../Project';
import { get } from 'lodash';
import {
  stakeholderLoadRequest,
  updateStakeholderField,
  stakeholderSaveRequest,
  loadNewStakeholder,
  stakeholderListRequest,
  stakeholderDeleteRequest
} from './redux/actions';
import {
  EditButton,
  ConfirmButton,
  DeleteButton,
  CancelButton
} from '../../../components/Buttons/Buttons';
import { Diagram } from '../Diagram';

import QuestionImg from '../../../assets/question.svg';
import FileImg from '../../../assets/file.svg';

const Stakeholder = () => {
  
  const dispatch = useDispatch();
  const [editId, setEditMode] = useState('');
  const [newStakeholder, setNewStakeholder] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deletedId, setDeletedId] = useState(null);

  const stakeholder = useSelector(
    state => state.app.stakeholderState.stakeholder.data,
  );
  const stakeholders = useSelector(
    state => state.app.stakeholderState.stakeholders.list,
  );
  const totalCount = useSelector(
    state => state.app.stakeholderState.stakeholders.totalCount,
  );

  const projects = useSelector(
    state => state.app.projectState.projects.list,
  );


  // useEffect(() => {
  //   dispatch(stakeholderListRequest());
  // }, [currentUser, dispatch]);
  
  const addStakeholer = () => {
    setNewStakeholder(true);
    dispatch(loadNewStakeholder());
  }
  const onUpdateField = field => event => {
    dispatch(updateStakeholderField(field, event.target.value));
  }
  const onConfirmStakeholder = () => {
    dispatch(stakeholderSaveRequest());
    setEditMode('');
    setNewStakeholder('');
  }

  const onCancelStakeholder = () => {
    if(editId) {
      setEditMode('');
    } else {
      setNewStakeholder(false);
    }
  }
  const onEditStakeholder = (id) => {
    dispatch(stakeholderLoadRequest(id));
    setEditMode(id);
  }
  const onDeleteStakeholder = id => {
    setDeletedId(id);
    setShowConfirm(true);
  }  
  const handleCancel = id => {
    setShowConfirm(false);
  }
  const handleConfirm = () => {
    dispatch(stakeholderDeleteRequest(deletedId));
    setShowConfirm(false);
  }
  
  const renderStakeholders = () => {
    if (!stakeholders.length) {
      return (
          <div colSpan="6" className="barlow-black-text">No Stakeholders</div>
      );
    }

    return stakeholders.map((sh, index) => (
      <Form.Group as={Row} key={sh._id} className="barlow-black-text">
        {/* <Form.Label column lg="3" xs="4">
          Stakeholder Name{index+1}:
        </Form.Label> */}
        {editId === sh._id
          ?
            <>
              <Col lg="7" xs="6" className="pt-2">
                <Form.Control
                  type="text"
                  value={get(stakeholder, 'name', '')}
                  onChange={onUpdateField('name')}
                  className="stakeholder-name"
                  placeholder={`stakeholder ${index}`}
                  required
                />
              </Col>
              <Col lg="2" xs="2" className="text-center pt-2 action-column">
                <ConfirmButton onClick={() => onConfirmStakeholder()} />
                <CancelButton onClick={() => onCancelStakeholder()} />
              </Col>
            </>
          :
          <>
            <Col lg="7" xs="6" className="pt-2">
              <div className="stakeholder-name">{get(stakeholders,[index, 'name'], '')}</div>
            </Col>
            <Col lg="2" xs="2" className="text-center pt-2 action-column">
              <EditButton onClick={() => onEditStakeholder(sh._id)} />
              <DeleteButton onClick={() => onDeleteStakeholder(sh._id)} />
            </Col>
          </>
        }
      </Form.Group>
    ));
  }

  const renderConfirmDialog = () => {
    return (
      <Modal show={showConfirm} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Deleting the Stakeholder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>The connections related to this stakeholder will be also removed. </p>
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
    <Container fluid>
      <Row>
        <Col lg={6}>
          <Project />
          <ConnectionTable />
        </Col>
        <Col lg={6}>
        <Card className="bg-light mt-5 px-5 position-relative">
            
            <Card.Body>
              <div className="flex-item-between mt10">
                <div className="flex-item header-title">
                    <img src={FileImg} alt="" className="file-img"/>
                    <p>Stakeholder</p>
                </div>
                <div>                   
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={
                      <Popover id={`popover-positioned-buttom`}>
                        <Popover.Title as="h3">Stakeholder!</Popover.Title>
                        <Popover.Content>
                          You can manage the stakeholders.
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
              </div>
              
              <hr/>
              <Button variant="primary" className="pull-right btn-add special" disabled={projects.length == 0} size="sm" onClick={() => addStakeholer()}>+ADD</Button>
              <Table striped bordered hover size="sm">
                <thead className="barlow-black-text">
                    <tr>
                        <th className="text-center w-5"></th>
                        <th className="text-center w-15">
                            Stakeholder Name
                        </th>
                        <th className="text-center w-5"></th>
                    </tr>
                </thead>
                <tbody className="barlow-light-text">
                    {!!stakeholders.length &&
                        stakeholders.map((sh, index) =>
                              editId === sh._id ? (
                                    <tr key={sh._id}>
                                        <td className="text-center">#{index + 1}</td>
                                        <td className="text-center">
                                          <Form.Control
                                            type="text"
                                            value={get(stakeholder, 'name', '')}
                                            onChange={onUpdateField('name')}
                                            className="stakeholder-name"
                                            placeholder={`stakeholder ${index}`}
                                            required
                                          />
                                        </td>
                                        <td className="text-center">
                                          <ConfirmButton onClick={() => onConfirmStakeholder()} />
                                          <CancelButton onClick={() => onCancelStakeholder()} />
                                        </td>
                                    </tr>
                                ) : (
                                    <tr key={sh._id}>
                                        <td className="text-center v-middle">#{index + 1}</td>
                                        <td className="text-center v-middle break-word"><div className="stakeholder-name">{get(stakeholders,[index, 'name'], '')}</div></td>
                                        <td className="text-center v-middle">
                                          <EditButton onClick={() => onEditStakeholder(sh._id)} />
                                          <DeleteButton onClick={() => onDeleteStakeholder(sh._id)} />
                                        </td>
                                    </tr>
                                )
                        )}
                        {newStakeholder && 
                            <tr>
                              <td className="text-center">#{stakeholders.length + 1}</td>
                              <td className="text-center">
                                <Form.Control
                                  type="text"
                                  onChange={onUpdateField('name')}
                                  className="stakeholder-name"
                                  placeholder={`stakeholder name`}
                                  required
                                />
                              </td>
                              <td className="text-center">
                                <ConfirmButton onClick={() => onConfirmStakeholder()} />
                                <CancelButton onClick={() => onCancelStakeholder()} />
                              </td>
                          </tr>
                        }
                </tbody>
            </Table>
              {/* {renderStakeholders()} */}
              {/* {newStakeholder && <Form.Group as={Row} className="barlow-black-text">
                  <Form.Label column lg="3" xs="4">
                    Stakeholder Name{stakeholders.length + 1}:
                  </Form.Label>
                  <Col lg="7" xs="6" className="mt-2">
                    <Form.Control
                      type="text"
                      onChange={onUpdateField('name')}
                      placeholder="stakeholder 1"
                      required
                    />
                  </Col>
                  <Col lg="2" xs="2" className="text-center pt-2 action-column">
                    <ConfirmButton onClick={() => onConfirmStakeholder()} />
                    <CancelButton onClick={() => onCancelStakeholder()} />               
                  </Col>
                </Form.Group>
              } */}              
            </Card.Body>
          </Card>
          <Diagram />
        </Col>
      </Row>
      {renderConfirmDialog()}
    </Container>
  );
};
export { Stakeholder };
