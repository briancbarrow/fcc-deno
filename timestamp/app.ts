import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
const HOST = "0.0.0.0";
const PORT = 8000;

const app = new Application();
const router = new Router();

router.get("/", async (ctx) => {
  // ctx.response.body = "Hello Tuesday Study Group!";
  console.log("CWD", Deno.cwd());
  const text = await Deno.readTextFile(`${Deno.cwd()}/timestamp/index.html`);
  ctx.response.headers.set("Content-Type", "text/html");
  ctx.response.body = text;
});

router.get("/public/:path+", async (ctx) => {
  await send(ctx, ctx.params.path || "", {
    root: `${Deno.cwd()}/public`,
  });
});

router.get("/api/:date", async (ctx) => {
  const date = ctx.params.date;
  const dateObj = new Date(date);
  ctx.response.body = {
    unix: dateObj.getTime(),
    utc: dateObj.toUTCString(),
  };
});

app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port ${PORT} ...`);
await app.listen(`${HOST}:${PORT}`);
