console.log(window.location);
console.log(window.location.search);
let params = new URLSearchParams(window.location.search);
let id = params.get("id");
console.log(id);

const postElement = document.getElementById("post");
console.log(postElement);

const fetchPostById = async (e) => {
  try {
    // const response =  await fetch('http://localhost:4000/graphql' + getQueryString(e))
    const response = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add auth headers here if needed
      },
      body: JSON.stringify({
        query: `
          query ExampleQuery($id: ID!) {
            post(id: $id) {
              title
              content
              author
              comments {
                content
                author
              }
            }
          }
        `,
        variables: {
          id: id,
        },
      }),
    });
    // console.log(response)
    // if (!response.ok) {
    //   throw new Error('API is down')
    // }
    const data = await response.json();
    console.log(data);
    const post = data.data.post;

    postElement.innerHTML = `
      <div>
        <p>
          <span class="author"><i>By ${post.author}</i></span>
          <h5>${post.title}</h5><br/>
          <p>${post.content}</p><br/>
          <span><a href="index.html">Back</a></span>
        <p>
      </div>`;

    const comments = post.comments
      .map(
        (comment) => `
      <div>
        <p>
          <span class="author"><i>By ${comment.author}</i></span>
          <p>${comment.content}</p><br/>
        <p>
      </div>`
      )
      .join("");

    postElement.innerHTML += `<section id="comments">
      <h4>Comments</h4>
      ${comments}
    </section>`;
  } catch (error) {
    postElement.innerHTML =
      "Opps something when wrong. Please try again later!";
    console.log(error);
  }
};

fetchPostById();
