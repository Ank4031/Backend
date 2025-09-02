import { Router } from "express";
import { addVideo, createPlaylist, deletePlaylist, getPlaylistById, getPlaylistByUser, removeVideo, updatePlaylist } from "../Controllers/playlist.controller.js";
import { verifyuser } from "../Middleware/auth.middleware.js";

const playlistRoute = Router()

playlistRoute.route("/create").post(
    verifyuser,
    createPlaylist
)

playlistRoute.route("/add/:playlistid/:videoid").patch(
    verifyuser,
    addVideo
)

playlistRoute.route("/remove/:playlistid/:videoid").patch(
    verifyuser,
    removeVideo
)

playlistRoute.route("/getbyid/:playlistid").get(
    getPlaylistById
)

playlistRoute.route("/getbyuser/:userid").get(
    getPlaylistByUser
)

playlistRoute.route("/update/:playlistid").patch(
    verifyuser,
    updatePlaylist
)

playlistRoute.route("/delete/:playlistid").delete(
    verifyuser,
    deletePlaylist
)

export default playlistRoute