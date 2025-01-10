import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/hooks/use-user';
import { useToast } from '@/hooks/use-toast';

const authSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useUser();
  const { toast } = useToast();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data: AuthFormData, isLogin: boolean) => {
    setIsLoading(true);
    try {
      const result = await (isLogin ? login(data) : register(data));
      if (!result.ok) {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1515542706656-8e6ef17a1521')] bg-cover bg-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center font-serif text-3xl">My Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => onSubmit(data, true))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Login'}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register">
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Register'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
