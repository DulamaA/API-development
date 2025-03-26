const API_URL = "http://localhost:3000/posts";

// Hämta ID från query string (?id=123)
const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

async function fetchPost() {
  if (!postId) {
    document.getElementById("postDetail").innerText = "Inget ID angivet.";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${postId}`);
    const data = await response.json();

    if (data.error) {
      document.getElementById("postDetail").innerText = data.error;
      return;
    }

    const post = data.post;
    document.getElementById("postDetail").innerHTML = `
      <h1>${post.title}</h1>
      <p><strong>Författare:</strong> ${post.author}</p>
      <p>${post.content}</p>
    `;
  } catch (err) {
    document.getElementById("postDetail").innerText =
      "Kunde inte ladda inlägget.";
  }
}

fetchPost();
