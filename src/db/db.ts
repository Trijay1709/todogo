import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

export function connectToDb() {
  const client = new Client({
    connectionString:
      "postgresql://trijay:Ebi_wB0ZfSjmVRGZZ0oY8w@boreal-rhino-5229.7s5.aws-ap-south-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full",
  });
  console.log(
    "hello1234567898765434567890[-09876543234567890-098765434567890-0987654567890-09876543"
  );

  client.connect();

  return drizzle(client);
}
