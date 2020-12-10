import './style.css';
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Layout from '../../components/Layout';
import Input from '../../components/UI/Input';
import { signup } from '../../actions/user.actions'
import usePasswordToggle from '../../hooks/usePasswordToggle';



const Signup = (props) => {
    // here in state.auth auth is our reducer from reducer index file
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [PasswordInputType, ToggleIcon] = usePasswordToggle();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const userSignup = (e) => {
        e.preventDefault();
        const user = { firstName, lastName, email, password };
        dispatch(signup(user))
    }

    if (auth.authenticate) {
        return <Redirect to={"/"} />
    }

    if (user.loading) {
        return <p>Loading .....</p>
    }

    return (
        <Layout>
            <h3 style={{ textAlign: "center" }} className="mt-3">{user.message}</h3>
            <Row className="mt-5">
                <Col md={{ span: 6, offset: 3 }}>
                    <Form className="mt-5" onSubmit={userSignup}>
                        <Row>
                            <Col md={6}>
                                <Input
                                    id="firstName"
                                    label="First Name"
                                    type="text"
                                    placeholder="Enter First Name"
                                    value={firstName}
                                    onChange={(e) => { setFirstName(e.target.value) }}
                                />
                            </Col>
                            <Col md={6}>
                                <Input
                                    id="lastName"
                                    label="Last Name"
                                    type="text"
                                    placeholder="Enter Last Name"
                                    value={lastName}
                                    onChange={(e) => { setLastName(e.target.value) }}
                                />
                            </Col>
                        </Row>
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="Enter Email"
                            error="We'll never share your email with anyone else."
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                        />
                        <div className="toggle_password_container">
                            <Input
                                id="password"
                                label="Password"
                                type={PasswordInputType}
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            <span className="password_toggle_icon">{ToggleIcon}</span>
                        </div>
                        <Button variant="primary" type="submit">Signup</Button>
                    </Form>
                </Col>
            </Row>
        </Layout >
    );
};

export default Signup;