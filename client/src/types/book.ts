export interface Book {
  id: number;
  name: string;
  isbn: string;
  description: string;
  pageCount: number;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;
