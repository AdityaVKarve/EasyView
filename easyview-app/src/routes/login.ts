import { Router } from "express";
import { renderTemplate } from "../utils/templateRenderer";

const router = Router();

router.get("/login", async (req, res) => {
  try {
    const content = await renderTemplate("login", {
      title: "Welcome to EasyView App",
      message: "This page is built with Bun, TailwindCSS, and Handlebars.",
      showNavbar: false 
    });
    res.send(content);
  } catch (error) {
    res.status(500).send("Error rendering page");
  }
});

export default router; 
