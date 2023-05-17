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
function delay() {
  return new Promise((resolve) => setTimeout(resolve, 5000));
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

router.post("/dg", async (ctx) => {
  const reqBody = await ctx.request.body().value;
  console.log("dg", reqBody);
  ctx.response.body = { ...reqBody, text: "Hello World!" };
});

router.get("/api", async (ctx) => {
  await delay();
  ctx.response.body = {
    text: "Hello UtahJS!",
    date: getDateObj(new Date()),
  };
});

router.get("/vue-booklist", async (ctx) => {
  const res = await fetch(
    `https://api.airtable.com/v0/appXd7WLn2TcOPHUO/tblSfUXw95ob9ArvH`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("AIRTABLE_TOKEN")}`,
      },
    }
  );
  const books = await res.json();
  console.log("books", books);
  ctx.response.headers.set("Content-Type", "application/json");
  ctx.response.body = books;
});

app.use(oakCors());
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on port ${PORT} ...`);
await app.listen(`${HOST}:${PORT}`);
