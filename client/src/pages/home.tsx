import { useQuery } from '@tanstack/react-query';
import { Book, Loader2, Edit, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import { bookApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function Home() {
  const { data: books, isLoading } = useQuery({
    queryKey: ['books'],
    queryFn: bookApi.getAll
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-primary">My Library</h1>
        <Link href="/book/new">
          <Button>Add New Book</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books?.map((book) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  {book.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">By {book.author}</p>
                <p className="text-sm mb-4">{book.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {book.pageCount} pages
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/book/edit/${book.id}`}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
