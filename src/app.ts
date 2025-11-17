import fastify from "fastify";
import cookie from "@fastify/cookie";
import { userRoutes } from "./routes/userRoute"; 
import { mealsRoutes } from "./routes/mealsRoute";

export const app = fastify()

app.register(cookie, {
    hook: 'onRequest',
}) 

app.register(userRoutes, {
    prefix:'/user',
})

app.register(mealsRoutes, {
    prefix: '/meals'
})