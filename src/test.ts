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

  type TestType = 'TEST';
  interface TestProps {
    rel: Integer;
  }
  const testRelationshipSchema = neogm.schema.relationship<TestType, TestProps>(
    'TEST',
    {
      rel: {
        type: Integer,
        default: int(123),
        mandatory: false,
      },
    }
  );

  type TestNodeLabels = ['Test', 'Node'];
  interface TestNodeProps {
    prop: NeoDate;
  }
  const testNodeSchema = neogm.schema.node<TestNodeLabels, TestNodeProps>(
    ['Test', 'Node'],
    {
      prop: {
        type: NeoDate,
        default: NeoDate.fromStandardDate(new Date()),
        mandatory: true,
      },
      allowedRelationships: {
        [testRelationshipSchema.type]: {
          direction: 'out',
        },
      },
    }
  );

  const TestNode = neogm.model.node('TestNode', testNodeSchema);
  const doc = TestNode.create({
    prop: new NeoDate(int(2000), int(2), int(2)),
  });

  console.log(doc.labels);
  console.log(doc.properties);
  console.log(doc.toObject());
  console.log(doc.toString());

  const r = await doc.save();
  console.log(r);
};

main().catch(e => console.error(e));
