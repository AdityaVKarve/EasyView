import { Router } from "express";
import { renderTemplate } from "../utils/templateRenderer";
import { ensureAuthenticated } from "../middleware/auth";

const router = Router();

router.get("/contact", ensureAuthenticated, async (req, res) => {
  try {
    const content = await renderTemplate("contact", {
      currentRoute: "contact",
      title: "Contact",  
      showNavbar: true 
    });
    res.send(content);
  } catch (error) {
    res.status(500).send("Error rendering page");
  }
});

export default router;