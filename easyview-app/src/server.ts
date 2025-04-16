import express from "express";
import passport from "passport";
import supabase from "./supabase_config";
import session from "express-session";
import "./passport_config";
import authRoutes from "./routes/auth";
import indexRoutes from "./routes/index";
import loginRoutes from "./routes/login";
import dashboardRoutes from "./routes/dashboard"
import contactRoutes from "./routes/contact"
import aboutRoutes from "./routes/about"
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";
import hbs from "express-handlebars";

const app = express();



// Middleware
app.use(express.static("public"));
app.use(session({ secret: "your_secret_key", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

//Helper to make use of eq and JSON stringify
Handlebars.registerHelper("eq", function(a: any, b: any) {
  return a === b;
});

//Helper to stringify jsons
Handlebars.registerHelper("JSONstringify", function(context: any) {
  return JSON.stringify(context);
});


//Serve static files
app.use(express.static(path.join(__dirname, "static")));

//navbar helper
Handlebars.registerHelper("isActive", function(route: string, currentRoute: string) {
  return route === currentRoute ? "active" : "";
});

//templating helpers
const blocks: Record<string, Handlebars.HelperDelegate[]> = {};

Handlebars.registerHelper("extend", function(name: string, context: any) {
  if (!blocks[name]) {
    blocks[name] = [];
  }
  blocks[name].push(context.fn(this));
});

Handlebars.registerHelper("block", function(name: string) {
  const val = (blocks[name] || []).join("\n");

  // Clear the block for reuse
  blocks[name] = [];
  return val;
});


//register partials
const partialsDir = path.resolve(__dirname, "./views/partials");
fs.readdirSync(partialsDir).forEach((file) => {
  const filePath = path.join(partialsDir, file);
  const partialName = path.basename(file, ".hbs");
  const partialContent = fs.readFileSync(filePath, "utf-8");
  Handlebars.registerPartial(partialName, partialContent);
});

// Use routes
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/", loginRoutes);
app.use("/", dashboardRoutes);
app.use("/", contactRoutes);
app.use("/", aboutRoutes);
app.use((err, req, res, next) => {
  console.error('Auth Error:', err);
  res.status(500).send("Authentication error");
});

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});