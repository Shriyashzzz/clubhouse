import { pool } from "../models/pool.js";

const signUpNewUser = async (
  fname,
  lname,
  email,
  username,
  password,
  status,
) => {
  const user = await pool.query(
    `
            INSERT INTO users(fname, lname, email, username, password, status  )
            VALUES ($1,  $2, $3, $4, $5 ,$6)
            RETURNING id;
    `,
    [fname, lname, email, username, password, status],
  );
  return user.rows[0].id;
};
export default { signUpNewUser };
