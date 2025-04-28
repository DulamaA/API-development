const postElement = document.getElementById("posts");

const getQueryString = (e) => {
  if (e !== undefined) {
    console.log(e.target);
    console.log(e.target.name);
    console.log(e.target.value);
    return `/?${e.target.name}=${e.target.value}`;
  }

  return "";
};

// rewrite the above code with async/await and try/catch
const fetchPosts = async (e) => {
  const id = 1;
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
          query ExampleQuery {
            posts {
              id
              title
              author
              comments {
                content
                author
              }
            }
          }
        `,
      }),
    });
    // console.log(response)
    // if (!response.ok) {
    //   throw new Error('API is down')
    // }
    const data = await response.json();
    console.log(data.data);

    console.log(
      "This will not be shown if an error occurs with the fetch, as long as errorhandling is not implemented"
    );

    postElement.innerHTML = data.data.posts
      .map(
        (post) => `
      <div>
        <p>
          <span class="author"><i>By ${post.author}</i></span>
          <h5>${post.title}</h5><br/>
          <span><a href="post.html?id=${post.id}">View</a></span>
        <p>
      </div>`
      )
      .join("");
  } catch (error) {
    postElement.innerHTML =
      "Opps something when wrong. Please try again later!";
    console.log(error);
  }
};

fetchPosts();

console.log(
  "This will execute before all other console.logs. Thats because the Fetch is an asynchronous operation"
);
