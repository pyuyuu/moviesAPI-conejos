const express = require("express");
const Movie = require("../models/Movie");
const { errorHandler } = require("../auth");

module.exports.addMovie = async (req, res) => {
  try {
    const { title, director, year, description, genre } = req.body;
    const newMovie = new Movie({ title, director, year, description, genre });
    const savedMovie = await newMovie.save();
    return res.status(201).send(savedMovie);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({}).lean().exec();
    return res.status(200).send({ movies: movies });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.getMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).lean().exec();
    return res.status(200).send(movie);
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.updateMovie = async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res.status(200).send({
      message: "Movie updated successfully",
      updatedMovie: updatedMovie,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    return res.status(200).send({ message: "Movie deleted successfully" });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const userId = req.user.id;

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    }

    const newComment = { userId, comment };
    movie.comments.push(newComment);

    const updatedMovie = await movie.save();

    return res.status(200).send({
      message: "Comment added successfully",
      updatedMovie,
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};

module.exports.getComments = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);


    if (!movie) {
      return res.status(404).send({ message: "Movie not found" });
    }


    return res.status(200).send({
      comments: movie.comments.map((comment) => ({
        userId: comment.userId,
        comment: comment.comment, 
        _id: comment._id,
      })),
    });
  } catch (error) {
    errorHandler(error, req, res);
  }
};
