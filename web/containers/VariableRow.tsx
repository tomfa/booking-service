import { useTheme } from 'styled-components';
import { IconButton, IconType } from '../components/Icon';
import { KeyedVariable, UpdateVariableFunc } from '../providers/PDFProvider';
import { NameInput, Row, ValueInput } from './VariableRow.styles';

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
      <IconButton
        icon={IconType.CHECK}
        onClick={() =>
          updateVariable(variable.key, { value: null, label: variable.label })
        }
        color={theme.colors.textPrimary}
        hoverColor={theme.colors.success}
      />
    </Row>
  );
};
