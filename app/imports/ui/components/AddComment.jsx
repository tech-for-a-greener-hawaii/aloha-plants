import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, ErrorsField, HiddenField, SubmitField, TextField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import PropTypes from 'prop-types';
import { Comments } from '../../api/forums/Comments';

// Create a schema to specify the structure of the data to appear in the form.
const formSchema = Comments.schema;

const bridge = new SimpleSchema2Bridge(formSchema);

/* Renders the AddStuff page for adding a document. */
const AddComment = ({ forumID, owner }) => {
  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { date, comment } = data;
    Comments.collection.insert(
      { date, forumID, comment, owner },
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
    <Container className="pt-5">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className="text-center" />
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card className="flush">
              <Card.Body>
                <TextField className="pb-2" name="comment" />
                <SubmitField value="Submit" />
                <ErrorsField />
                <HiddenField name="owner" value={owner} />
                <HiddenField name="forumID" value={forumID} />
                <HiddenField name="date" value={new Date()} />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  );
};

AddComment.propTypes = {
  forumID: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
};

export default AddComment;
