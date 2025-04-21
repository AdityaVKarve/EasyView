import { Router } from "express";
import { renderTemplate } from "../utils/templateRenderer";
import {ensureAuthenticated} from "../middleware/auth";

const router = Router();

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const content = await renderTemplate("login", {
      title: "Login"
    });
    res.send(content);
  } catch (error) {
    res.status(500).send("Error rendering page");
  }
});

export default router;