import { Router } from "express";
import { renderTemplate } from "../utils/templateRenderer";
import { ensureAuthenticated } from "../middleware/auth";

const router = Router();

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  try {
    const content = await renderTemplate("dashboard", {
      currentRoute: "dashboard",  // Highlight 'dashboard' in the navbar
      title: "Dashboard",  // Set the page title
      showNavbar: true 
    });
    res.send(content);
  } catch (error) {
    res.status(500).send("Error rendering page");
  }
});

export default router;