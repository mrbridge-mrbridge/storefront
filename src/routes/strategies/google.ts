import express from 'express'
import passport from 'passport';


export const googleRouter = express.Router()

googleRouter.get(
  "/",
  passport.authenticate("google", {scope : ['profile', 'email']})
);

googleRouter.get(
  "/redirect",
  passport.authenticate("google", {
    successRedirect: "https://storefrontsmes.amalitech-dev.net/",
    failureRedirect: "https://storefrontsmes.amalitech-dev.net/",
  })
);
