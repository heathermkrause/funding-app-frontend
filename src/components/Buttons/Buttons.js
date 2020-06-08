import React from 'react';
import { Icon } from '../Icon';
import {
    Button
} from 'react-bootstrap';

const ButtonGroup = props => {
    return (
        <td className="d-flex justify-content-between">
            {props.buttons}
        </td>
    );
}

const EditButton = props => {
    return (
        <Button type="button" onClick={props.onClick} variant="secondary" size="sm"><Icon name="pencil"></Icon></Button>
    )
}

const DeleteButton = props => {
    return (
        <Button type="button" onClick={props.onClick} variant="danger" size="sm"><Icon name="trash" /></Button>
    )
}

const ConfirmButton = props => {
    return (
        <Button type="button" onClick={props.onClick} variant="success" size="sm"><Icon name="save" /></Button>
    )
}

const CancelButton = props => {
    return (
        <Button type="button" onClick={props.onClick} variant="danger" size="sm"><Icon name="remove" /></Button>
    )
}

const AddButton = props => {
    return (
        <Button type="button" onClick={props.onClick} variant="primary" size="sm"><Icon name="plus" /></Button>
    )
}

export { EditButton, DeleteButton, ConfirmButton, CancelButton, ButtonGroup, AddButton }