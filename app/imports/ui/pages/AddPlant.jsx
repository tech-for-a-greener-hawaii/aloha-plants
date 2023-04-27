import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Plants } from '../../api/plants/Plants';
import { PageIDs } from '../utilities/ids';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = new SimpleSchema({
  name: String,
  scientificName: String,
  indigenousStatus: String,
  description: String,
  growingConditions: String,
  propogation: String,
  range: String,
  culturalUses: String,
  pests: String,
  picture: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the Add Plant page for adding a plant. */

const AddPlant = () => {
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, scientificName, indigenousStatus, description, growingConditions, propogation, range, culturalUses, pests, picture } = data;
    Plants.collection.insert(
      { name, scientificName, indigenousStatus, description, growingConditions, propogation, range, culturalUses, pests, picture },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Plant added successfully', 'success');
          formRef.reset();
        }
      },
    );
  };

  let fRef = null;
  return (
    <Container className="py-3">
      <Row id={PageIDs.addPlantPage} className="justify-content-center">
        <Col xs={5}>
          <Col className="text-center"><h2>Add Plants</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <TextField name="name" />
                  </Col>
                  <Col>
                    <TextField name="scientificName" />
                  </Col>
                  <Col>
                    <TextField name="indigenousStatus" />
                  </Col>
                </Row>
                <LongTextField name="description" />
                <Row>
                  <Col>
                    <TextField name="growingConditions" />
                  </Col>
                  <Col>
                    <TextField name="propogation" />
                  </Col>
                  <Col>
                    <TextField name="range" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <TextField name="culturalUses" />
                  </Col>
                  <Col>
                    <TextField name="pests" />
                  </Col>
                  <Col>
                    <TextField name="picture" />
                  </Col>
                </Row>
                <SubmitField className="text-center" value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

export default AddPlant;
