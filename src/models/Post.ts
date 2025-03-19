export class Post {
  id: number = 0;
  titel: string = "";
  content: string = "";
  author: string = "";

  constructor(titel: string, content: string, author: string) {
    this.id = Math.round(Math.random() * 1000);
    this.titel = titel;
    this.content = content;
    this.author = author;
  }
}
