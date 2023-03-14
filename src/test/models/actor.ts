import { actorSchema } from './../schemas/actor';
import neogm from '../..';

export const Actor = neogm.model.node('Actor', actorSchema);
