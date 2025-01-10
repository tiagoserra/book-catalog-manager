import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useParams } from 'wouter';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { bookApi } from '@/lib/api';
import type { BookFormData } from '@/types/book';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  description: z.string().min(1, 'Description is required'),
  pageCount: z.number().min(1, 'Page count must be at least 1'),
  author: z.string().min(1, 'Author is required')
});

export default function BookForm() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const form = useForm<BookFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      isbn: '',
      description: '',
      pageCount: 0,
      author: ''
    }
  });

  const { isLoading: isLoadingBook } = useQuery({
    queryKey: ['book', id],
    queryFn: () => bookApi.getById(Number(id)),
    enabled: isEditing,
    onSuccess: (data) => {
      form.reset(data);
    }
  });

  const mutation = useMutation({
    mutationFn: (data: BookFormData) => {
      return isEditing
        ? bookApi.update(Number(id), data)
        : bookApi.create(data);
    },
    onSuccess: () => {
      toast({
        title: `Book ${isEditing ? 'updated' : 'created'} successfully`,
        variant: 'default'
      });
      setLocation('/');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const onSubmit = (data: BookFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-4xl font-serif font-bold text-primary mb-8">
        {isEditing ? 'Edit Book' : 'Add New Book'}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ISBN</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pageCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Count</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? 'Saving...' : 'Save Book'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation('/')}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
