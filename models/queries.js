import { pool } from "./pool.js";
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

const getMessages = async () => {
  try {
    const messages = await pool.query(
      `
    SELECT users.id, users.username, users.email, users.status , messages.*
    FROM users
    JOIN messages
    ON users.id = messages.user_id;
      `,
    );
    return messages.rows;
  } catch (e) {
    throw new Error(e);
  }
};
export { signUpNewUser, makeMemberVip, getMessages };
