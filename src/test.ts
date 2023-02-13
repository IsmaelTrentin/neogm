import { Integer, Date as NeoDate, int } from 'neo4j-driver';

import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';
import neogm from './index';

dotenv.config();

const main = async () => {
  if (!process.env.DB_URL) {
    const err = { message: 'no DB_URL provided in .env', code: 500 };
    throw err;
  }
  if (!process.env.DB_USER) {
    const err = { message: 'no DB_USER provided in .env', code: 500 };
    throw err;
  }
  if (!process.env.DB_PWD) {
    const err = { message: 'no DB_PWD provided in .env', code: 500 };
    throw err;
  }

  const dbAuth = {
    url: process.env.DB_URL,
    user: process.env.DB_USER,
    pwd: process.env.DB_PWD,
  };

  const auth = neo4j.auth.basic(dbAuth.user, dbAuth.pwd);
  try {
    await neogm.connect(dbAuth.url, auth);
    console.log('connected to db');
  } catch (error) {
    throw error;
  }

  type MovieLabels = ['Movie'];
  interface MovieProps {
    title: string;
  }
  const movieSchema = neogm.schema.node<MovieLabels, MovieProps>(['Movie'], {
    title: {
      type: String,
      mandatory: true,
    },
  });

  type AuthorLabels = ['Author'];
  interface AuthorProps {
    name: string;
    dob: NeoDate;
  }
  const authorSchema = neogm.schema.node<AuthorLabels, AuthorProps>(
    ['Author'],
    {
      name: {
        type: String,
        mandatory: true,
      },
      dob: {
        type: NeoDate,
        mandatory: true,
      },
    }
  );

  type STARS_IN_Type = 'STARS_IN';
  interface STARS_IN_Props {
    as: string;
  }
  const starsInSchema = neogm.schema.relationship<
    STARS_IN_Type,
    STARS_IN_Props
  >('STARS_IN', {
    as: {
      type: String,
      mandatory: true,
    },
  });

  type TEST_Type = 'TEST';
  interface TEST_Props {
    test: Integer;
  }
  const testSchema = neogm.schema.relationship<TEST_Type, TEST_Props>('TEST', {
    test: {
      type: Integer,
      mandatory: true,
      default: int(1),
    },
  });

  authorSchema.defineRelationship({
    schema: starsInSchema,
    direction: 'out',
    nodeSchema: movieSchema,
  });

  // authorSchema.defineRelationship({
  //   schema: testSchema,
  //   direction: 'in',
  //   nodeSchema: authorSchema,
  // });

  movieSchema.defineRelationship({
    schema: starsInSchema,
    direction: 'in',
    nodeSchema: authorSchema,
  });

  const Author = neogm.model.node('Author', authorSchema);
  const Movie = neogm.model.node('Movie', movieSchema);
  const STARS_IN = neogm.model.relationship('STARS_IN', starsInSchema);
  const TEST = neogm.model.relationship('TEST', testSchema);

  const authorDoc = Author.create({
    name: 'Leonardo Di Caprio',
    dob: new NeoDate(int(1970), int(1), int(1)),
  });

  // console.log(authorDoc.toString());

  const movieDoc = Movie.create({
    title: 'Wolfs of Wallstreet',
  });

  const starsInDoc = STARS_IN.create({
    as: 'Non mi ricordo',
  });
  const testRelDoc = TEST.create({
    test: int(1),
  });

  authorDoc.addRelationship<typeof starsInSchema, typeof movieSchema>(
    starsInDoc,
    movieDoc,
    'out'
  );
};

main().catch(e => console.error(e));
