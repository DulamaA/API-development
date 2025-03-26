const API_URL = "http://localhost:3000/posts";

async function fetchPosts() {
  const search = document.getElementById("searchInput").value;
  const sort = document.getElementById("sortSelect").value;

  let url = `${API_URL}?`;
  if (search) {
    url += `search=${encodeURIComponent(search)}&`;
  }
  if (sort) {
    url += `sort=${sort}`;
  }

  const response = await fetch(url);
  const posts = await response.json();
  showPosts(posts);
}

function showPosts(posts) {
  const container = document.getElementById("postList");
  container.innerHTML = "";

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.className = "post";
    div.innerHTML = `
      <h2>${post.title}</h2>
      <p><strong>Författare:</strong> ${post.author}</p>
      <p>${post.content.slice(0, 100)}... <a href="#">Läs mer</a></p>
    `;
    container.appendChild(div);
  });
}

window.onload = fetchPosts;
