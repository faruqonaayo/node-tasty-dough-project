import { db } from "../util/dbConnect.js";

export default async function autoDel(req, res, next) {
  const allSessions = await db.query("SELECT * FROM sessions");
  const allSessonsResult = allSessions.rows;
  //   console.log(allSessonsResult);
  const expiredSessions = allSessonsResult.filter(
    (session) =>
      new Date(session.sess.cookie.expires).toISOString() <
      new Date().toISOString()
  );

  expiredSessions.forEach(async (session) => {
    await db.query("DELETE FROM cart_products WHERE session_id = $1", [
      session.sid,
    ]);
    await db.query("DELETE FROM sessions WHERE sid = $1", [session.sid]);
  });
  next();
}
