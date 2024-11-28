const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movies");
const { verify, verifyAdmin } = require("../auth");

router.post("/addMovie", verify, movieController.addMovie);

router.get("/getMovies", verify, movieController.getMovies);

router.get("/getMovie/:id", verify, movieController.getMovie);

router.patch("/updateMovie/:id", verify, movieController.updateMovie);

router.delete("/deleteMovie/:id", verify, movieController.deleteMovie);

router.patch("/addComment/:id", verify, movieController.addComment);

router.get("/getComments/:id", verify, movieController.getComments);



module.exports = router;