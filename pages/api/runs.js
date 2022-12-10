//posts.js

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("running");
  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      await db.collection("runs").insertOne(bodyObject);
      break;
    case "GET":
      const allPosts = await db.collection("runs").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
  }
}
