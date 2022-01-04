import express from "express";
import { Server as WebSocketServer } from "socket.io";
import http from "http";
import { v4 as uuid } from "uuid";

const app = express();
const httpServer = http.createServer(app);
const io = new WebSocketServer(httpServer);

let notes = [];

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log("New connection: " + socket.id);

  socket.emit("server:rendernotes", notes);

  socket.on("client:newnote", (data) => {
    const note = {
      id: uuid(),
      ...data,
    };

    notes.push(note);

    io.emit("server:newnote", note);
  });

  socket.on("client:updatenote", (data) => {
    notes = notes.map((note) => {
      if (note.id == data.id) {
        note.title = data.title;
        note.description = data.description;
      }

      return note;
    });

    io.emit("server:rendernotes", notes);
  });

  socket.on("client:deletenote", (noteId) => {
    notes = notes.filter((note) => note.id !== noteId);
    io.emit("server:rendernotes", notes);
  });

  socket.on("client:getnote", (noteId) => {
    const note = notes.find((note) => note.id === noteId);
    socket.emit("server:selectednote", note);
  });
});

httpServer.listen(3000, () => {
  console.log("Server on port 3000");
});
