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
        <Form.Label column lg="3">
          Stakeholder Name{index+1}:
        </Form.Label>
        {editId === sh._id
          ?
            <>
              <Col lg="7" className="pt-2">
                <Form.Control
                  type="text"
                  value={get(stakeholder, 'name', '')}
                  onChange={onUpdateField('name')}
                  className="stakeholder-name"
                  placeholder={`stakeholder ${index}`}
                  required
                />                
              </Col>
              <Col lg="2" className="text-center pt-2">
                <ConfirmButton onClick={() => onConfirmStakeholder()} />
                <CancelButton onClick={() => onCancelStakeholder()} />
              </Col>
            </>
          :
          <>
            <Col lg="7" className="pt-2">
              <div className="stakeholder-name">{get(stakeholders,[index, 'name'], '')}</div>
            </Col>
            <Col lg="2" className="text-center pt-2">
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
        <Col lg={5}>

          <Project />

          <Card className="bg-light mt-5 px-5 position-relative">
            <Card.Body>
              
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

              {renderStakeholders()}
              {newStakeholder && <Form.Group as={Row} className="barlow-black-text">
                  <Form.Label column lg="3">
                    Stakeholder Name{stakeholders.length + 1}:
                  </Form.Label>
                  <Col lg="7" className="mt-2">
                    <Form.Control
                      type="text"
                      onChange={onUpdateField('name')}
                      placeholder="stakeholder 1"
                      required
                    />
                  </Col>
                  <Col lg="2" className="text-center pt-2">
                    <ConfirmButton onClick={() => onConfirmStakeholder()} />
                    <CancelButton onClick={() => onCancelStakeholder()} />               
                  </Col>
                </Form.Group>
              }
              <Button variant="primary" className="pull-right btn-add" size="sm" onClick={() => addStakeholer()}>+ADD NEW</Button>
            </Card.Body>
          </Card>

          <ConnectionTable />
          
        </Col>
        <Col lg={7}>
          <Diagram />
        </Col>
      </Row>
      {renderConfirmDialog()}
    </Container>
  );
};
export { Stakeholder };
