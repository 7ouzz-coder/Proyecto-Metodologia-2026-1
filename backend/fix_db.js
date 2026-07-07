import pkg from 'pg';
const { Client } = pkg;

async function fix() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'Metodo',
    password: '1345',
    port: 5432,
  });
  await client.connect();
  await client.query('DROP TABLE IF EXISTS pre_registros CASCADE;');
  await client.end();
  console.log("Fixed DB");
}
fix();
