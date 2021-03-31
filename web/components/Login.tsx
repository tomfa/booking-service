import { useCallback, useRef, useState } from 'react';
import { LoginData } from '../providers/AuthProvider';
import { Main } from './Main.styles';
import { Button } from './Button';
import { IconType } from './Icon';
import { LineHeader } from './LineHeader';
import { FormInput } from './FormInput';
import { FormError } from './FormError';

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
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      });
      setLoading(false);
    },
    [setLoading, onSubmit]
  );
  return (
    <Main>
      <LineHeader icon={IconType.AUTH} header={'Log in'} hideButton />
      <form onSubmit={onFormSubmit}>
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
        <Button label={isLoading ? '...' : 'Log in'} type={'submit'} />
        <FormError hidden={!error} error={error} />
      </form>
    </Main>
  );
};
