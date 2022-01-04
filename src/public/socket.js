const socket = io();

/**
 * Save a new note
 * @param {string} title
 * @param {string} description
 */
const saveNote = (title, description) => {
  socket.emit("client:newnote", {
    title,
    description,
  });
};

/**
 * Updata a specific note
 * @param {string} id
 * @param {string} title
 * @param {string} document
 */
const updateNote = (id, title, description) => {
  socket.emit("client:updatenote", {
    id,
    title,
    description,
  });
};

const deleteNote = (id) => {
  socket.emit("client:deletenote", id);
};

const getNote = (id) => {
  socket.emit("client:getnote", id);
};

socket.on("server:newnote", appendNote);

socket.on("server:rendernotes", renderNotes);

socket.on("server:selectednote", (note) => {
  const title = document.querySelector("#title");
  const description = document.querySelector("#description");

  title.value = note.title;
  description.value = note.description;

  noteId = note.id;
});
