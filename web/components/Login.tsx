import { useCallback, useRef, useState } from 'react';
import { LoginData } from '../providers/AuthProvider';
import { Main } from './Main.styles';
import { Button } from './Button';
import { IconType } from './Icon';
import { LineHeader } from './LineHeader';
import { FormInput } from './FormInput';
import { FormError } from './FormError';
import { Form } from './Form.styles';

type Props = { error?: string; onSubmit: (data: LoginData) => Promise<void> };
export const Login = ({ onSubmit, error }: Props) => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const onFormSubmit = useCallback(
    async e => {
      e.preventDefault();
      setLoading(true);
      await onSubmit({
        username: usernameRef.current.value.toLowerCase().trim(),
        password: passwordRef.current.value,
      });
      setLoading(false);
    },
    [setLoading, onSubmit]
  );
  return (
    <Main>
      <LineHeader icon={IconType.AUTH} header={'Log in'} hideButton />
      <Form onSubmit={onFormSubmit}>
        <FormInput
          label={'Username'}
          name={'username'}
          type={'text'}
          inputRef={usernameRef}
        />
        <FormInput
          label={'Password'}
          name={'password'}
          type={'password'}
          inputRef={passwordRef}
        />
        <Button
          large
          label={isLoading ? '...' : 'Log in'}
          type={'submit'}
          style={{ marginTop: '1rem' }}
        />
        <FormError hidden={!error} error={error} />
      </Form>
    </Main>
  );
};
