//posts.js

import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("running");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  

  const bodyObject = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

  switch (req.method) {
    case "POST":
      await db.collection("runs").insertOne(bodyObject);
      break;
    case "GET":
      const allPosts = await db.collection("runs").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
    case "DELETE":
      await db.collection("runs").deleteOne({ "_id": new ObjectId(bodyObject._id) });
      break;
    case "PUT":
      const { _id, ...rest } = bodyObject;

      await db.collection("runs").updateOne({ "_id": new ObjectId(_id) }, { $set: { ...rest } });
      break;
  }
}
