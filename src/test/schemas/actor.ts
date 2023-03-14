import neogm from './../../index';
import { ActorLabels, ActorProps } from '../@types';

export const actorSchema = neogm.schema.node<ActorLabels, ActorProps>(
  ['Actor'],
  {
    name: {
      type: String,
      default: 'asd',
    },
  }
);
