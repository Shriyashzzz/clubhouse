import { pool } from "../models/pool.js";
import bcrypt from "bcryptjs";
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

const makeMemberVip = async (id) => {
  try {
    await pool.query(
      `
        UPDATE users 
        SET status = 'VIP'  
        WHERE id = $1
        `,
      [id],
    );
  } catch (e) {
    throw new Error(e);
  }
};
export { signUpNewUser, makeMemberVip };
