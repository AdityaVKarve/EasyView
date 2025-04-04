import type { Request, Response, NextFunction } from "express";


//Check if the user is authenticated
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    console.log("User Authenticated:", req.isAuthenticated()); // Debugging output
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login"); // Ensure this points to a real login page, not "/"
  };