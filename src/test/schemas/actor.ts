import neogm from './../../index';
import { ActorLabels, ActorProps } from '../@types';

export const actorSchema = neogm.schema.node<ActorLabels, ActorProps>(
  ['Actor'],
  {
    name: {
      // remove type?? no need to track it since
      // there is no migration needed to be pushed
      // agains the db.
      type: String,
      default: 'asd',
      // relationship: true  (makes rest never)
      //               false (makes reldata never)
    },
  }
);
