import { Client } from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    fname TEXT NOT NULL, 
    lname TEXT NOT NULL, 
    email TEXT NOT NULL, 
    username VARCHAR(40) NOT NULL UNIQUE, 
    password TEXT NOT  NULL, 
    status VARCHAR(40) 
);

CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(80),  
    messages VARCHAR(300),
    date VARCHAR(30)
); 


`;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    client.connect();
    console.log("seeding");
    await client.query(SQL);
  } catch (e) {
    console.log(`error seeding ${e.mesesage}`);
    throw new Error(e);
  } finally {
    console.log(`finshed seeding`);
    client.end();
  }
}

main();
