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
  type TestRelationshipType = 'TEST';
  interface TestRelationshipProps {
    test: string;
  }

  const testRelSchema = neogm.schema.relationship<
    TestRelationshipType,
    TestRelationshipProps
  >('TEST', {
    test: {
      type: String,
      mandatory: false,
    },
  });

  type NodeLabels = readonly ['Entity', 'NodeTest'];
  interface NodeProps {
    prop: Integer;
    dob: NeoDate;
    message: string;
  }

  const nodeSchema = neogm.schema.node<NodeLabels, NodeProps>(
    ['Entity', 'NodeTest'],
    {
      message: String,
      dob: NeoDate,
      prop: Integer,
    }
  );

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

  // (:Entity:NodeTest)-[:TEST]->(:Movie)
  nodeSchema.defineRelationship({
    schema: testRelSchema,
    nodeSchema: movieSchema,
    direction: 'out',
  });

  movieSchema.defineRelationship({
    schema: testRelSchema,
    direction: 'in',
    nodeSchema: nodeSchema,
  });

  const Node = neogm.model.node<typeof nodeSchema>('Node', nodeSchema);
  const doc = Node.create({
    dob: new NeoDate(int(1000), int(1), int(1)),
    prop: int(1),
    message: 'msg',
  });
  // doc.addRelationship<typeof movieSchema>({
  //   schema: testRelSchema,
  //   node: movieSchema,
  //   direction: 'out',
  // });
  doc.addRelationship({
    relationship: {
      direction: 'out',
      type: testRelSchema.type,
      properties: {
        test: 'test prop on rel',
      },
    },
    node: {
      labels: ['Movie'],
      properties: {},
    },
  });
};

main().catch(e => console.error(e));
