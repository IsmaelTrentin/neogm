import dotenv from 'dotenv';
import neogm from '..';
import { auth } from 'neo4j-driver';

dotenv.config();

const main = async () => {
  await neogm.connect(
    process.env.DB_URL as string,
    auth.basic(process.env.DB_USER as string, process.env.DB_PWD as string)
  );
};

main();
