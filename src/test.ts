import { Date, Integer, int } from 'neo4j-driver';

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
};

main().catch(e => console.error(e));
