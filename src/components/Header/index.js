import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap'
import { NavLink, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signout } from '../../actions/auth.actions'
import useThemeSwitcher from '../../hooks/useThemeSwitcher'


const Header = (props) => {
    const auth = useSelector(state => state.auth)
    console.log("Auth data : ", auth);
    const dispatch = useDispatch();
    const ThemeSwitcher = useThemeSwitcher()


    const logout = () => {
        dispatch(signout());
    }

    const renderLoggedInLinks = () => {
        return (
            <Nav>
                <li className="nav-item">
                    <span style={{ cursor: "pointer" }} className="nav-link" onClick={logout}>Signout</span>
                </li>
            </Nav>
        );
    }

    const renderNotLoggedInLinks = () => {
        return (
            <Nav>
                <li className="nav-item">
                    <NavLink to="/signin" className="nav-link">Signin</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/signup" className="nav-link">Signup</NavLink>
                </li>
            </Nav>
        );
    }
    //capitalize only the first letter of the string. 
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    //capitalize all words of a string. 
    // function capitalizeWords(string) {
    //     return string.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    // };

    const titleCase = (str) => {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    return (
        <Navbar collapseOnSelect fixed="top" expand="lg" bg="dark" variant="dark" style={{ zIndex: 1 }} className="d-flex justify-content-sm-between">
            <Container fluid>
                {/* <Link to="/" className="navbar-brand">Welcome {capitalizeFirstLetter(auth.user.fullName)} Dashboard</Link> */}
                <Link to="/" className="navbar-brand">Welcome {auth.user.fullName ? titleCase(auth.user.fullName) : null} Dashboard</Link>
                {/* <h5 style={{ color: 'white', textAlign: 'center', margin: '0px' }}>Welcome {capitalizeWords(auth.user.fullName)}</h5> */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto"></Nav>
                    <span style={{ textAlign: 'center' }}>{ThemeSwitcher}</span>
                    {auth.authenticate ? renderLoggedInLinks() : renderNotLoggedInLinks()}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;