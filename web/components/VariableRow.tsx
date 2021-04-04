import { useTheme } from 'styled-components';
import { KeyedVariable, UpdateVariableFunc } from '../providers/PDFProvider';
import { IconType } from './Icon';
import {
  NameInput,
  Row,
  ValueInput,
  VariableDangerButton,
} from './VariableRow.styles';

export const VariableRow = ({
  variable,
  updateVariable,
}: {
  variable: KeyedVariable;
  updateVariable: UpdateVariableFunc;
}) => {
  const theme = useTheme();
  return (
    <Row>
      <NameInput
        type={'text'}
        value={variable.label}
        onChange={e =>
          updateVariable(variable.key, {
            label: e.target.value,
            value: variable.value,
          })
        }
      />
      <ValueInput
        type={'text'}
        value={variable.value}
        onChange={e =>
          updateVariable(variable.key, {
            value: e.target.value,
            label: variable.label,
          })
        }
      />
      <VariableDangerButton
        icon={IconType.REMOVE}
        onClick={() =>
          updateVariable(variable.key, { value: null, label: variable.label })
        }
        hoverColor={theme.colors.danger}
        size={20}
      />
    </Row>
  );
};
