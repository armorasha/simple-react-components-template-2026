import React, { useState } from 'react';
import Links from '../../Components/Links';
import AuthLayout from '../../Layouts/AuthLayout';
import Card from '../../Components/Card';
import TextInput from '../../Components/TextInput';
import Checkbox from '../../Components/Checkbox';
import Button from '../../Components/Button';
import { Heading2, Muted } from '../../Components/Typography';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <AuthLayout>
      <Card>
        <Heading2>Sign in</Heading2>
        <Muted>Access the Interface Terminal</Muted>

        <form className="flex flex-col gap-4 mt-6" onSubmit={(e) => e.preventDefault()}>
          <TextInput
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            label="Password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Checkbox
            label="Remember me"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <Button variant="primary" type="submit">
            Sign in
          </Button>
        </form>

        <Links to="/" chevron="left" className="mt-6">
          Back to style guide
        </Links>
      </Card>
    </AuthLayout>
  );
}
