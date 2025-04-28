import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # Most used Datatypes: Int, Float, String, Boolean, ID, 
  # ID with exclamation (ID!) means is required, NOT NULL 

  # This "Post" type defines the queryable fields for every post in our data source.
  type Post {
    id: ID!
    title: String!
    content: String!
    author: String!
    comments: [Comment!]
  }


  type Comment {
    id: ID!
    content: String!
    author: String!
    post: Post!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "posts" query returns an array of zero or more Posts (defined above).
  type Query {
    posts: [Post]
    post(id: ID!): Post
    comments: [Comment]
    comment(id: ID!): Comment
  }
`;

const posts = [
  {
    id: "1",
    title: "The Awakening",
    content: "Content about The Awakening",
    author: "Kate Chopin",
  },
  {
    id: "2",
    title: "City of Glass",
    content: "Content about City of Glass",
    author: "Paul Auster",
  },
];
const comments = [
  {
    id: "1",
    content: "comment 1",
    author: "Kate Chopin",
    post_id: "1",
  },
  {
    id: "2",
    content: "comment 2",
    author: "Paul Auster",
    post_id: "2",
  },
  {
    id: "3",
    content: "comment 3",
    author: "John Doe",
    post_id: "1",
  },
  {
    id: "4",
    content: "comment 4",
    author: "Jane Doe",
    post_id: "1",
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves posts from the "posts" array above.
const resolvers = {
  Query: {
    posts: () => posts,
    comments: () => comments,
    post: (_: any, args: { id: string }) =>
      posts.find((post) => post.id === args.id),
    comment: (_: any, args: { id: string }) =>
      comments.find((comment) => comment.id === args.id),
  },
  Post: {
    comments: (parent: { id: string }) =>
      comments.filter((comment) => comment.post_id === parent.id),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
