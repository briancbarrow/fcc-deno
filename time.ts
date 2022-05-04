import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

router.get("/", (ctx, next) => {
  // handle the GET endpoint here
  ctx.response.body = "Hello From Router!";
});

router.get("/api/:date", (ctx, next) => {
  // handle the GET endpoint here
  console.log("ctx", ctx);
  const date = ctx.params.date;
  const dateObj = new Date(date);
  if (dateObj.toUTCString() !== "Invalid Date") {
    ctx.response.body = {
      unix: dateObj.getTime(),
      utc: dateObj.toUTCString(),
    };
  } else {
    ctx.response.body = {
      error: "Invalid Date",
    };
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

// app.use((ctx) => {
//   ctx.response.body = "Hello Study Group!";
// });

await app.listen({ port: 8000 });
