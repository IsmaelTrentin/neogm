import { movieSchema } from './../schemas/movie';
import neogm from './../../index';

export const Movie = neogm.model.node('Movie', movieSchema);
