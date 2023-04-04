import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField, SelectField } from 'uniforms-bootstrap5';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import { addProjectMethod } from '../../startup/both/Methods';
import { Interests } from '../../api/interests/Interests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from './pageStyles';
import { ComponentIDs, PageIDs } from '../utilities/ids';

/* Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests, allParticipants) => new SimpleSchema({
  name: String,
  description: String,
  homepage: String,
  picture: String,
  interests: { type: Array, label: 'Interests', optional: false },
  'interests.$': { type: String, allowedValues: allInterests },
  participants: { type: Array, label: 'Participants', optional: true },
  'participants.$': { type: String, allowedValues: allParticipants },
});

/* Renders the Page for adding a project. */
const AddProject = () => {

  /* On submit, insert the data. */
  const submit = (data, formRef) => {
    Meteor.call(addProjectMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Project added successfully', 'success').then(() => formRef.reset());
      }
    });
  };

  const { ready, interests, profiles } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    const sub1 = Meteor.subscribe(Interests.userPublicationName);
    const sub2 = Meteor.subscribe(Profiles.userPublicationName);
    const sub3 = Meteor.subscribe(ProfilesInterests.userPublicationName);
    const sub4 = Meteor.subscribe(ProfilesProjects.userPublicationName);
    const sub5 = Meteor.subscribe(Projects.userPublicationName);
    return {
      ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
      interests: Interests.collection.find().fetch(),
      profiles: Profiles.collection.find().fetch(),
    };
  }, []);

  let fRef = null;
  const allInterests = _.pluck(interests, 'name');
  const allParticipants = _.pluck(profiles, 'email');
  const formSchema = makeSchema(allInterests, allParticipants);
  const bridge = new SimpleSchema2Bridge(formSchema);
  const transform = (label) => ` ${label}`;
  /* Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  return ready ? (
    <Container style={pageStyle}>
      <Row id={PageIDs.addProjectPage} className="justify-content-center">
        <Col xs={10}>
          <Col className="text-center"><h2>Add Project</h2></Col>
          <AutoForm ref={ref => { fRef = ref; }} schema={bridge} onSubmit={data => submit(data, fRef)}>
            <Card>
              <Card.Body>
                <Row>
                  <Col xs={4}><TextField id={ComponentIDs.addProjectFormName} name="name" showInlineError placeholder="Project name" /></Col>
                  <Col xs={4}><TextField id={ComponentIDs.addProjectFormPicture} name="picture" showInlineError placeholder="Project picture URL" /></Col>
                  <Col xs={4}><TextField id={ComponentIDs.addProjectFormHomePage} name="homepage" showInlineError placeholder="Homepage URL" /></Col>
                </Row>
                <LongTextField id={ComponentIDs.addProjectFormDescription} name="description" placeholder="Describe the project here" />
                <Row>
                  <Col xs={6} id={ComponentIDs.addProjectFormInterests}>
                    <SelectField name="interests" showInlineError placeholder="Interests" multiple checkboxes transform={transform} />
                  </Col>
                  <Col xs={6} id={ComponentIDs.addProjectFormParticipants}>
                    <SelectField name="participants" showInlineError placeholder="Participants" multiple checkboxes transform={transform} />
                  </Col>
                </Row>
                <SubmitField id={ComponentIDs.addProjectFormSubmit} value="Submit" />
                <ErrorsField />
              </Card.Body>
            </Card>
          </AutoForm>
        </Col>
      </Row>
    </Container>
  ) : <LoadingSpinner />;
};

export default AddProject;
