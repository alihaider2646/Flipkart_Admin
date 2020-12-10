import './style.css';
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Layout from '../../components/Layout';
import Input from '../../components/UI/Input';
import { login } from '../../actions'
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import usePasswordToggle from '../../hooks/usePasswordToggle';


const Signin = (props) => {
    // with this useSelector we can get the state store value
    const auth = useSelector(state => state.auth)
    const dispatch = useDispatch();

    const [PasswordInputType, ToggleIcon] = usePasswordToggle();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const userLogin = (e) => {
        e.preventDefault();
        const user = { email, password };
        dispatch(login(user));
    }

    if (auth.authenticate) {
        // return <Redirect to="/" />
        // *****************************   OR   *****************************
        return <Redirect to={"/"} />
    }

    return (
        <Layout>
            <Container>
                <Row className="mt-5">
                    <Col md={{ span: 6, offset: 3 }}>
                        <Form className="mt-5" onSubmit={userLogin}>
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="Enter Email"
                                error="We'll never share your email with anyone else."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="toggle_password_container">
                                <Input
                                    id="password"
                                    label="Password"
                                    type={PasswordInputType}
                                    placeholder="Enter Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span className="password_toggle_icon">{ToggleIcon}</span>
                            </div>
                            <Button variant="primary" type="submit">Signin</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default Signin;