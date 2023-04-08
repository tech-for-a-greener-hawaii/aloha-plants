import React from 'react';
import { Col, Container, Image, Row, Carousel } from 'react-bootstrap';
import { PageIDs } from '../utilities/ids';

/* A simple static component to render some text for the landing page. */
const Landing = () => (
  <div id={PageIDs.landingPage}>
    <div className="landing-green-background">
      <Container>
        <h1 style={{ paddingTop: '10px', paddingBottom: '15px', paddingLeft: '60px', color: 'white', fontSize: '50pt' }}>
          <strong>Aloha Plants</strong>
          <Image src="/images/flowers-1.png" width={100} paddingLeft={30} />
        </h1>
      </Container>
    </div>
    <div className="landing-lightGreen-background">
      <Container className="justify-content-center text-center">
        <Row>
          <Col xs={4}>
            <Carousel>
              <Carousel.Item>
                <img
                  className="d-block w-100"
                  src="holder.js/800x400?text=First slide&bg=373940"
                  alt="First slide"
                />
                <Carousel.Caption>
                  <h3>First slide label</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </Col>
          <Col xs={4}>
            <Image src="/images/profiles-page.png" width={400} />
          </Col>
          <Col xs={4}>
            <Image src="/images/profiles-page.png" width={400} />
          </Col>
        </Row>
      </Container>
    </div>
    <div className="landing-green-background">
      <Container className="justify-content-center text-center">
        <h2 style={{ color: 'white' }}>...then add your projects</h2>
        <Row md={1} lg={2}>
          <Col xs={6}>
            <Image src="/images/add-project-page.png" width={500} />
          </Col>
          <Col xs={6}>
            <Image src="/images/projects-page.png" width={500} />
          </Col>
        </Row>
      </Container>
    </div>
    <div className="landing-white-background text-center">
      <h2 style={{ color: '#376551' }}>
        Connect to people and projects with shared interests!
      </h2>
      <Container>
        <Row md={1} lg={2}>
          <Col xs={6}>
            <Image src="/images/interests-page.png" width={500} />
          </Col>
          <Col xs={6}>
            <Image src="/images/filter-page.png" width={500} />
          </Col>
        </Row>
      </Container>
    </div>
  </div>
);

export default Landing;
