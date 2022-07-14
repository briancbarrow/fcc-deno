import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const HOST = "0.0.0.0";
const PORT = 8000;

const app = new Application();
const router = new Router();

function getDateObj(dateObj: Date) {
  return {
    unix: dateObj.getTime(),
    utc: dateObj.toUTCString(),
  };
}

router.get("/", async (ctx) => {
  // ctx.response.body = "Hello Tuesday Study Group!";
  const text = await Deno.readTextFile(`${Deno.cwd()}/timestamp/index.html`);
  ctx.response.headers.set("Content-Type", "text/html");
  ctx.response.body = text;
});

router.get("/public/:path+", async (ctx) => {
  await send(ctx, ctx.params.path || "", {
    root: `${Deno.cwd()}/timestamp/public`,
  });
});

router.get("/api/:date", (ctx) => {
  const date = ctx.params.date;
  let dateObj = new Date(date);

  if (dateObj.toString() === "Invalid Date") {
    dateObj = new Date(+date);
    if (dateObj.toString() === "Invalid Date") {
      ctx.response.body = {
        error: "Invalid Date",
      };
      return;
    }
  }
  ctx.response.body = {
    text: "How Fast was that?",
    date: getDateObj(dateObj),
  };
});

router.get("/api", (ctx) => {
  ctx.response.body = {
    text: "Hello there",
    date: `Today is ${getDateObj(new Date())}`,
  };
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port ${PORT} ...`);
await app.listen(`${HOST}:${PORT}`);
