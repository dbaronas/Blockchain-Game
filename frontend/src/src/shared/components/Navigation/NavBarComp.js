
import React from "react";
import { Navbar, Container, Nav} from "react-bootstrap";


import MainHeader from "./MainHeader";
import { from } from "form-data";

const NavBarComp = props => {
  return (
    <MainHeader>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">MetaOcean</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">About Us</Nav.Link>
            <Nav.Link href="#features">Team</Nav.Link>
            <Nav.Link href="#pricing">Launch Game</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </MainHeader>
  );
};

export default NavBarComp;