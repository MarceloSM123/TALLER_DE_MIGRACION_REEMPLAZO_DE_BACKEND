 import pg from "pg"
 import { PrismaPg } from "@prisma/adapter-pg"
 import {PrismaClient} from "../../generated/prisma/client.js"

 const pool = new pg.Pool({
connectionString: "postgresql://postgres:123MARCE%23@localhost:5432/jwt_bd?schema=public"
 })

 const adapter= new PrismaPg(pool)

 const prisma=new PrismaClient({adapter});

 export default prisma;