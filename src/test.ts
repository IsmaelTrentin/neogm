import { Date, Integer, int } from 'neo4j-driver';

import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';
import neogm from './index';

dotenv.config();

type PersonLabels = ['Entity', 'Person'];
interface IPerson {
  bid: Integer;
  dob: Date;
  name: string;
}

const personSchema = neogm.schema<PersonLabels, IPerson>(['Entity', 'Person'], {
  bid: {
    type: Integer,
    unique: true,
  },
  dob: {
    type: Date,
    default: new Date(int(2022), int(2), int(22)),
  },
  name: String,
});

const Person = neogm.model('Person', personSchema);

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

  const results = await Person.all();
  console.log(results.map(r => r.properties.name));

  // const node = Person.create({
  //   bid: int(3333),
  //   name: 'Refactor 2',
  //   dob: new Date(int(3333), int(3), int(3)),
  // });

  // console.log('labels', node.labels);
  // console.log('props ', node.properties);
  // console.log('str   ', node.toString());
  // console.log('obj   ', node.toObject());

  // const result = await node.save();
  // console.log('result', result);
};

main().catch(e => console.error(e));
