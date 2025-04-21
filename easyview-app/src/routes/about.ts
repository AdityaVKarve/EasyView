import { Router } from "express";
import { renderTemplate } from "../utils/templateRenderer";
import { ensureAuthenticated } from "../middleware/auth";

const router = Router();

router.get("/about", ensureAuthenticated, async (req, res) => {
  try {
    const content = await renderTemplate("about", {
      currentRoute: "about",
      title: "About", 
      showNavbar: true 
    });
    res.send(content);
  } catch (error) {
    res.status(500).send("Error rendering page");
  }
});

export default router;