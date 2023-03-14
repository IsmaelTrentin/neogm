import { likesSchema } from './../schemas/likes';
import neogm from '../..';

export const Likes = neogm.model.relationship('LIKES', likesSchema);
