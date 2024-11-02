import connect from '../startMongo'

export async function GET() {
  const client = await connect
  const cursor = await client.db("test").collection("notices").find();
  const notices = await cursor.toArray()

  return Response.json(notices)
}

export async function POST(request: Request){
  const client = await connect;
  const body = await request.json()
  await client.db("test").collection("notices").insertOne({ notice: body.notice, x: body.x, y: body.y });

  return Response.json({message: "successfully updated the document"})
}