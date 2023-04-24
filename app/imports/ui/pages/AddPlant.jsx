import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, LongTextField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Plants } from '../../api/plants/Plants';

// Create a schema to specify the structure of the data to appear in the form.
const makeSchema = (allInterests) => new SimpleSchema({
  name: String,
  scientificName: String,
  description: String,
  growingConditions: String,
  propagation: String,
  range: String,
  pests: String,
  interests: { type: Array, label: 'Interests', optional: false },
  'interests.$': { type: String, allowedValues: allInterests },
  picture: String,
});

const bridge = new SimpleSchema2Bridge(makeSchema);

/* Renders the AddPlant page for adding a document. */
const AddPlant = () => {

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { name, scientificName, description, growingConditions, propagation, range, pests, interests, picture } = data;
    Plants.collection.insert(
      { name, scientificName, description, growingConditions, propagation, range, pests, interests, picture },
      (error) => {
        if (error) {
          swal('Error', error.message, 'error');
        } else {
          swal('Success', 'Item added successfully', 'success');
          formRef.reset();
        }
      },
    );
  };

  // Render the form. Use Uniforms: https://github.com/vazco/uniforms
  let fRef = null;
  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center"><h2>Add Forum</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <TextField name="name" />
                    <TextField name="scientificName" />
                    <TextField name="description" />
                    <TextField name="growingConditions" />
                    <TextField name="propagation" />
                    <TextField name="range" />
                    <TextField name="pests" />
                    <TextField name="interest" />
                    <TextField name="picture" />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <LongTextField name="leadComment" />
                  </Col>
                  <SubmitField value="Submit" />
                </Row>
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
