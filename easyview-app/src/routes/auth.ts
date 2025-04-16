import { Router } from "express";
import passport from "passport";

const router = Router();

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Microsoft OAuth
router.get("/microsoft", passport.authenticate("microsoft", { scope: ["user.read"] }));

router.get(
  "/microsoft/callback",
  passport.authenticate("microsoft", { failureRedirect: "/", failureMessage: true }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// Logout
router.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

export default router;
