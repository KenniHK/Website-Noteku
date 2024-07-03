import "./styles/style.css";
import NotesApi from "./src/data/remote/notes-api";
import insertNote from "./src/data/remote/insert-api";
import removeNote from "./src/data/remote/delete-api";
import swal from "sweetalert";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const showNotesData = () => {
  NotesApi.getAllNotes()
    .then((result) => {
      if (result.length === 0) {
        displayNoNotesMessage();
      } else {
        displayNotes(result);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

function displayNoNotesMessage() {
  const noNotesTemplate = document.getElementById("noNotesTemplate");
  const noNotesElement = noNotesTemplate.content.cloneNode(true);
  document.body.appendChild(noNotesElement);
}
showNotesData();

function confirmActionConfirm() {
  closeModalConfirm();
}

function openModalConfirm() {
  document.getElementById("customModalConfirm").style.display = "block";
}

function closeModalConfirm() {
  document.getElementById("customModalConfirm").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function () {
  setSidebarHeight();
  const addNoteBtn = document.getElementById("addNoteBtn");
  const noteForm = document.getElementById("noteForm");
  const form = noteForm.querySelector("form");

  addNoteBtn.addEventListener("click", function () {
    noteForm.style.display = "block";
    gsap.to(addNoteBtn, {
      scale: 1.1,
      duration: 0.1,
      onComplete: () => {
        gsap.to(addNoteBtn, {
          scale: 1,
          duration: 0.5,
        });
      },
    });
  });

  const titleInput = form.elements.title;
  const noteBodyInput = form.elements.notes;

  form.addEventListener("submit", (event) => event.preventDefault());

  const customValidationTitleHandler = (event) => {
    event.target.setCustomValidity("");

    if (!event.target.validity.valid) {
      event.target.setCustomValidity("Judul harus di isi");
      return;
    }
  };

  const customValidationBodyHandler = (event) => {
    event.target.setCustomValidity("");

    if (!event.target.validity.valid) {
      event.target.setCustomValidity("Deskripsi harus di isi");
      return;
    }
  };

  titleInput.addEventListener("change", customValidationTitleHandler);
  titleInput.addEventListener("invalid", customValidationTitleHandler);

  titleInput.addEventListener("blur", (event) => {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute("aria-describedby");
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;

    if (connectedValidationEl && errorMessage && !isValid) {
      connectedValidationEl.innerText = errorMessage;
    } else {
      connectedValidationEl.innerText = "";
    }
  });

  noteBodyInput.addEventListener("change", customValidationBodyHandler);
  noteBodyInput.addEventListener("invalid", customValidationBodyHandler);

  noteBodyInput.addEventListener("blur", (event) => {
    const isValid = event.target.validity.valid;
    const errorMessage = event.target.validationMessage;

    const connectedValidationId = event.target.getAttribute("aria-describedby");
    const connectedValidationEl = connectedValidationId
      ? document.getElementById(connectedValidationId)
      : null;

    if (connectedValidationEl && errorMessage && !isValid) {
      connectedValidationEl.innerText = errorMessage;
    } else {
      connectedValidationEl.innerText = "";
    }
  });

  /* masukin ke API */
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const title = formData.get("title");
    const body = formData.get("notes");

    insertNote(title, body).then(() => {
      noteForm.style.display = "none";
      form.reset();
    });
  });
});

window.confirmActionConfirm = confirmActionConfirm;
window.closeModalConfirm = closeModalConfirm;

function setSidebarHeight() {
  const sidebar = document.querySelector(".justify-content");
  const bodyHeight = document.body.clientHeight;
  sidebar.style.height = bodyHeight + "vh";
}

const notesData = [];

const notesContainer = document.getElementById("notes-data");

function displayNotes(notesData) {
  notesContainer.innerHTML = "";

  notesData.forEach((note) => {
    const noteElement = document.createElement("div");
    const titleElement = document.createElement("h2");
    const dateElement = document.createElement("p");
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btnDel");
    deleteButton.innerHTML = "Hapus";

    deleteButton.addEventListener("click", function () {
      const noteId = note.id;
      removeNote(noteId);
    });

    titleElement.textContent = note.title;
    dateElement.textContent = new Date(note.createdAt).toLocaleDateString();

    noteElement.appendChild(titleElement);
    noteElement.appendChild(dateElement);
    noteElement.appendChild(deleteButton);

    noteElement.addEventListener("click", function () {
      const notesDisplayData = document.getElementById("displayNotesData");
      const titleDisplay = document.createElement("h2");
      const bodyElement = document.createElement("p");
      const dateDisplay = document.createElement("p");

      titleDisplay.textContent = note.title;
      bodyElement.textContent = note.body;
      dateDisplay.textContent = new Date(note.createdAt).toLocaleDateString();

      const dataContainer = document.createElement("div");
      dataContainer.classList.add("cardDisplay");

      notesDisplayData.innerHTML = "";
      dataContainer.appendChild(titleDisplay);
      dataContainer.appendChild(bodyElement);
      dataContainer.appendChild(dateDisplay);

      notesDisplayData.appendChild(dataContainer);
    });

    noteElement.classList.add("displayNotes");

    notesContainer.appendChild(noteElement);

    gsap.to(noteElement, {
      scale: 1.1,
      duration: 1,
      onComplete: () => {
        gsap.to(noteElement, {
          scale: 1,
          duration: 0.5,
        });
      },
    });
  });
}

class formInput extends HTMLElement {
  constructor() {
    super();

    this.render();
  }

  render() {
    this.innerHTML = `
  <div id="noteForm" class="popup-form">
            <form>
            <label for="title">Title :</label><br>
                <input
                id="title" 
                type="text" 
                name="title" 
                placeholder="Enter Title" 
                aria-describedby="titleValidation"
                required><br>
                
                <p id="titleValidation" class="validation-message" aria-live="polite"></p>

                
              <label for="notes">Description :</label><br>
                <textarea 
                id="notebody"
                name="notes" 
                placeholder="Enter Your Notes" 
                aria-describedby="bodyValidation"
                rows="8" cols="50"
                required></textarea>

                <p id="bodyValidation" class="validation-message" aria-live="polite"></p>
                <button type="submit">Add</button>
            </form>
            </div>
            `;
  }
}

customElements.define("form-input", formInput);

class modalPop extends HTMLElement {
  constructor() {
    super();

    this.render();
  }

  render() {
    this.innerHTML = `
            <div id="customModalConfirm" class="modal">
            <div class="modal-content">
              <span class="close" onclick="closeModalConfirm()">&times;</span>
              <h2>Success</h2><br>
              <p>Notes have been added to the list!</p><br>
              <button class="confirm" onclick="confirmActionConfirm()">Ok</button>
            </div>
          </div>
          `;
  }
}

customElements.define("modal-pop", modalPop);

class navbar extends HTMLElement {
  constructor() {
    super();

    this.render();
    this.animateTagline();
  }

  render() {
    this.innerHTML = `
  <nav class="nav" id="titleTXT">Noteku</nav>
  <p class='tag-line'></p>
   `;
  }
  animateTagline() {
    gsap.to(".tag-line", {
      duration: 2,
      text: "Satu Tempat untuk Semua Pikiran Anda.",
    });
  }
}

customElements.define("nav-bar", navbar);
