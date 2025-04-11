import { RowDataPacket } from "mysql2";

export interface IPostDBResponse extends RowDataPacket {
  post_id: number;
  post_content: string;
  post_title: string;
  post_author: string;
  post_created_at: string;
  comment_id: number;
  comment_post_id: number;
  comment_title: string;
  comment_content: string;
  comment_author: string;
  comment_created_at: string;
}
