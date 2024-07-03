export const BASE_URL = "https://notes-api.dicoding.dev/v2";

class NotesApi {
  static getAllNotes() {
    const loadingIndicator = document.getElementById("loadingIndicator");
    loadingIndicator.style.display = "block";

    return fetch(`${BASE_URL}/notes`)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          swal("Error", "Ada yang salah.", "error");
          throw new Error("Ada yang salah.");
        }
      })
      .then((responseJson) => {
        loadingIndicator.style.display = "none";
        const { data: notesDataApi } = responseJson;

        if (notesDataApi.length > 0) {
          return Promise.resolve(notesDataApi);
        } else {
          return Promise.resolve([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        loadingIndicator.style.display = "none";
        return Promise.reject(error);
      });
  }
}

export default NotesApi;
