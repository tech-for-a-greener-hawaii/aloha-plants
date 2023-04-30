import React from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';
import { PageIDs } from '../utilities/ids';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <div id={PageIDs.landingPage}>
    <div className="landing-green-background">
      <Container className="text-center">
        <h1 style={{ paddingTop: '20px', color: 'white', fontSize: '36pt' }}>
          Welcome to Aloha-Plants
        </h1>
        <Row style={{ paddingBottom: '20px' }} />
      </Container>
    </div>
    <div className="landing-white-background">
      <Container className="justify-content-center text-center">
        <h2 style={{ paddingBottom: '20px', color: 'white' }}>Browse Hawai'i plants page and find local projects....</h2>
        <Row md={1} lg={2}>
          <Col xs={6}>
            <Image src="/images/plant-page.png" width={500} />
          </Col>
          <Col xs={6}>
            <Image src="/images/project-page.png" width={500} />
          </Col>
        </Row>
      </Container>
    </div>
    <div className="landing-green-background">
      <Container className="justify-content-center text-center">
        <h2 style={{ paddingBottom: '20px', color: 'white' }}>....then check out the plant forums to discuss plant topics</h2>
        <Row md={1} lg={2}>
          <Col xs={6}>
            <Image src="/images/forum-page.png" width={500} />
          </Col>
          <Col xs={6}>
            <Image src="/images/add-forum.png" width={500} />
          </Col>
        </Row>
      </Container>
    </div>
    <div className="landing-white-background text-center">
      <h2 style={{ paddingBottom: '20px', color: 'white' }}>
        Become a creator to start your own project or add in missing plant data!
      </h2>
      <Container>
        <Row md={1} lg={2}>
          <Col xs={6}>
            <Image src="/images/add-project.png" width={500} />
          </Col>
          <Col xs={6}>
            <Image src="/images/add-plant.png" width={500} />
          </Col>
        </Row>
      </Container>
    </div>
  </div>
);

export default Landing;
