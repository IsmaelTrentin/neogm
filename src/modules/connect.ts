import neo4j, { AuthToken, Config, Session } from 'neo4j-driver';

// multiple sessions support???

let _session: Session | undefined = undefined;

export const session = {
  get() {
    if (_session) {
      return _session as Session;
    }
    throw new Error('No session started');
  },
  async close() {
    _session && (await _session.close());
  },
};

export const connect = async (
  url: string,
  authToken?: AuthToken,
  config?: Config
) => {
  const driver = neo4j.driver(url, authToken, config);
  _session = driver.session();
  // return _session;
};
