import { Icon, IconType } from './Icon';
import { FormErrorText, FormErrorWrapper } from './FormError.styles';

type FormErrorProps = {
  error?: string;
  hidden?: boolean;
};
export const FormError = ({ error, hidden = false }: FormErrorProps) => {
  return (
    <FormErrorWrapper $hidden={hidden}>
      <Icon icon={IconType.WARN} size={20} withPadding />
      <FormErrorText>{error}</FormErrorText>
    </FormErrorWrapper>
  );
};
