import React from 'react';
import { Formik } from 'formik';
import {
  Form,
  Card,
  Container,
  Row,
  Col,
  InputGroup,
  Button,
} from 'react-bootstrap';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { resetPasswordRequest } from '../redux/actions';
import { Icon } from '../../../components/Icon';

import Logo from '../../../assets/company-logo.png';

const schema = Yup.object({
  email: Yup.string()
    .email('Email must be valid')
    .required('Email is required!'),
  password: Yup.string().required('Password is required!'),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match.')
    .required('Passwords must match.'),
});

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPasswordPage = ({ location }) => {
  const dispatch = useDispatch();
  let query = useQuery();

  const token = query.get("token");
  const email = query.get("email");
  
  const handleSubmit = values => {
    const { email, password } = values;
    dispatch(resetPasswordRequest({ email, password, token }));
  };

 

  return (
    <Container className="h-75">
      <Row className="h-100 align-items-center justify-content-center"> 
        <Col xs={5}>
          <div className="logo-part">
            <img src={Logo} alt="" className="auth-logo"/>
          </div>
          <Card>
            <Card.Header bg="secondary" className="text-center">
              <h3>Reset Password</h3>
            </Card.Header>
            <Card.Body>
              <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                  email: email,
                  password: '',
                  passwordConfirm: '',
                }}
              >
                {({ handleSubmit, handleChange, values, isValid, errors }) => (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row}>                      
                      <Col xs={12}>
                        <InputGroup>
                          <InputGroup.Prepend>
                            <InputGroup.Text>
                              <Icon name="envelope" />
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control
                            type="text"
                            placeholder="Input your email"
                            name="email"
                            disabled
                            value={values.email}
                            onChange={handleChange}
                            isInvalid={!!errors.email}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Col xs={12}>
                        <InputGroup>
                          <InputGroup.Prepend>
                            <InputGroup.Text>
                              <Icon name="lock" />
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control
                            type="password"
                            placeholder="Input your password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.password}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row}>            
                      <Col xs={12}>
                        <InputGroup>
                          <InputGroup.Prepend>
                            <InputGroup.Text>
                              <Icon name="lock" />
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <Form.Control
                            type="password"
                            placeholder="Confirm your password"
                            name="passwordConfirm"
                            value={values.passwordConfirm}
                            onChange={handleChange}
                            isInvalid={!!errors.passwordConfirm}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.passwordConfirm}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Col>
                    </Form.Group>
                    <div className="text-center flex-center auth-btn">
                      <Button
                        block
                        variant="secondary"
                        type="submit"
                        disabled={!isValid}
                      >
                        Reset Password
                      </Button>
                    </div>                    
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export { ResetPasswordPage };
