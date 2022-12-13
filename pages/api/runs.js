//posts.js

import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("running");

  console.log(req.method, req.body);

  switch (req.method) {
    case "POST":
      let bodyObject = JSON.parse(req.body);
      await db.collection("runs").insertOne(bodyObject);
      break;
    case "GET":
      const allPosts = await db.collection("runs").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
    case "DELETE":
      let bodyObject2 = req.body;
      await db.collection("runs").deleteOne({ "_id": new ObjectId(bodyObject2._id)});
      break;
    case "PUT":
      let bodyObject3 = req.body;
      const { _id, ...rest } = bodyObject3;

      await db.collection("runs").updateOne({ "_id": new ObjectId(_id) }, { $set: { ...rest } });
      break;
  }
}
