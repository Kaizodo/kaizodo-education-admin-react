import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthenticationService } from '@/services/AuthenticationService';
import { msg } from '@/lib/msg';
import { Storage } from '@/lib/storage';
import { useSetValue } from '@/hooks/use-set-value';
import CenterLoading from '@/components/common/CenterLoading';

const LoginForm = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "admin.education@kaizodo.com",
    password: "ktpl@education"
  });
  const setValue = useSetValue(setForm);
  const navigate = useNavigate();
  useEffect(() => {
    AuthenticationService.isAuthenticated().then(setIsAuthenticated).catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <CenterLoading />
  }

  if (isAuthenticated) {
    return <Navigate to={'/'} />
  }



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    var r = await AuthenticationService.login(form);
    if (r.success) {
      msg.success('Login successful');
      await Storage.set('token', r.data.token);
      navigate('/')
    }
    setIsLoading(false);
  };




  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="items-center justify-center flex">
            <img src='/logo/dark/lg.png' />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Super Admin</h1>
          <p className="text-gray-600 mt-2">Sign in to access your panel</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.username}
                  onChange={(e) => setValue('username')(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setValue('password')(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button type="submit" className="w-full" loading={isLoading} disabled={isLoading}>Sign In</Button>
            </form>
          </CardContent>
        </Card>


      </div>
    </div>
  );
};

export default LoginForm;