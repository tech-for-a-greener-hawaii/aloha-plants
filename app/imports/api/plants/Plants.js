import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

/** Encapsulates state and variable values for this collection. */
class PlantsCollection {
  constructor() {
    // The name of this collection.
    this.name = 'PlantsCollection';
    // Define the Mongo collection.
    this.collection = new Mongo.Collection(this.name);
    // Define the structure of each document in the collection.
    this.schema = new SimpleSchema({
      name: { type: String, unique: true},
      scientificName: { type: String, optional: true },
      indigenousStatus: { type: String, optional: true },
      description: { type: String, optional: true },
      growingConditions: { type: String, optional: true },
      propogation: { type: String, optional: true },
      range: {type:String, optional:true},
      culturalUses: {type:String, optional:true},
      pests: { type: String, optional: true },
      picture:{ type: String, optional: true},
    });
    // Ensure collection documents obey schema.
    this.collection.attachSchema(this.schema);
    // Define names for publications and subscriptions
    this.userPublicationName = `${this.name}.publication.user`;
    this.adminPublicationName = `${this.name}.publication.admin`;
  }
}

export const Plants = new PlantsCollection();
