import { BASE_URL } from "./notes-api";
import swal from "sweetalert";

const insertNote = (title, body) => {
  const note = {
    title: title,
    body: body,
  };

  return fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gagal input note");
      }
      return response.json();
    })
    .then((responseJson) => {
      showResponseMessage(responseJson.message, true);
    })
    .catch((error) => {
      showResponseMessage(error.message, false);
    });
};

const showResponseMessage = (message, isSuccess) => {
  if (isSuccess) {
    swal("Success", message, "success").then(() => {
      location.reload();
    });
  } else {
    swal("Gagal memasukkan data", message, "error").then(() => {
      location.reload();
    });
  }
};
export default insertNote;
