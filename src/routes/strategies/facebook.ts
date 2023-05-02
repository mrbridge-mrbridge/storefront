import express from "express";
import passport from "passport";

export const facebookRouter = express.Router();

facebookRouter.get("/", passport.authenticate("facebook", { scope: "email" }));

facebookRouter.get(
    "/redirect",
    passport.authenticate("facebook", {
        successRedirect: "https://storefrontsmes.amalitech-dev.net/",
        failureRedirect: "https://storefrontsmes.amalitech-dev.net/",
    })
);
