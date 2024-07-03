import { BASE_URL } from "./notes-api";
import swal from "sweetalert";

const removeNote = (note_id) => {
  return fetch(`${BASE_URL}/notes/${note_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to delete note");
      }
    })
    .then((data) => {
      swal("Sukses", "Data berhasil dihapus", "success").then(() => {
        location.reload();
      });
    })
    .catch((error) => {
      showResponseMessage(error.message);
    });
};

const showResponseMessage = (message) => {
  swal("Gagal hapus data", message, "error");
};

export default removeNote;
