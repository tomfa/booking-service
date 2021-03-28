import { useCallback, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import { IconButton, IconType } from '../components/Icon';
import {
  AddVariableFunc,
  KeyedVariable,
  UpdateVariableFunc,
} from '../providers/PDFProvider';
import { VariableRow } from './VariableRow';
import { NameInput, Row, ValueInput } from './VariableRow.styles';

export const VariableEditor = ({
  variables,
  onAddVariable,
  updateVariable,
}: {
  variables: KeyedVariable[];
  onAddVariable: AddVariableFunc;
  updateVariable: UpdateVariableFunc;
}) => {
  const theme = useTheme();
  const [nextVariableName, setNextVariableName] = useState<string>('');
  const [nextVariableValue, setNextVariableValue] = useState<string>('');
  const nameInput = useRef(null);
  const valueInput = useRef(null);

  const addVariable = useCallback(
    (name: string, label: string) => {
      if (!name) {
        return;
      }
      setNextVariableName('');
      setNextVariableValue('');
      onAddVariable(name, label);
    },
    [onAddVariable]
  );
  return (
    <>
      <Row>
        <NameInput
          type={'text'}
          value={nextVariableName}
          ref={nameInput}
          onChange={e => setNextVariableName(e.target.value)}
          placeholder={'variable'}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              valueInput.current.focus();
            }
          }}
        />
        <ValueInput
          type={'text'}
          value={nextVariableValue}
          ref={valueInput}
          placeholder={'value'}
          onChange={e => setNextVariableValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              addVariable(nextVariableName, nextVariableValue);
              nameInput.current.focus();
            }
          }}
        />
        <IconButton
          icon={IconType.CHECK}
          onClick={() => addVariable(nextVariableName, nextVariableValue)}
          hoverColor={theme.colors.success}
        />
      </Row>
      {variables.map(variable => (
        <VariableRow
          key={variable.key}
          variable={variable}
          updateVariable={updateVariable}
        />
      ))}
    </>
  );
};
