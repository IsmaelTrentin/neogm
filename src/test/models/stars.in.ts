import neogm from './../..';
import { starsInSchema } from './../schemas/stars.in';

export const StarsIn = neogm.model.relationship('STARS_IN', starsInSchema);
