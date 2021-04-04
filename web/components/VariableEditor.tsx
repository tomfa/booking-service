import { useCallback, useMemo, useRef, useState } from 'react';
import { useTheme } from 'styled-components';
import {
  AddVariableFunc,
  KeyedVariable,
  UpdateVariableFunc,
  usePDFGenerator,
} from '../providers/PDFProvider';
import { useAuth } from '../providers/AuthProvider';
import { IconType } from './Icon';
import { VariableRow } from './VariableRow';
import {
  NameInput,
  Row,
  ValueInput,
  VariableButtonDisabled,
  VariableButtonSuccess,
} from './VariableRow.styles';

export const VariableEditor = ({
  variables,
  onAddVariable,
  updateVariable,
}: {
  variables: KeyedVariable[];
  onAddVariable: AddVariableFunc;
  updateVariable: UpdateVariableFunc;
}) => {
  const auth = useAuth();
  const { selectedTemplate } = usePDFGenerator();
  const theme = useTheme();
  const [nextVariableName, setNextVariableName] = useState<string>('');
  const [nextVariableValue, setNextVariableValue] = useState<string>('');
  const nameInput = useRef(null);
  const valueInput = useRef(null);
  const disabledVariables = useMemo(
    () =>
      Object.entries({
        template: selectedTemplate.filename,
        _id: selectedTemplate.id,
        token: auth.apiKey,
      }),
    [auth.apiKey, selectedTemplate]
  );

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
        <VariableButtonSuccess
          icon={IconType.CHECK}
          onClick={() => addVariable(nextVariableName, nextVariableValue)}
          hoverColor={theme.colors.success}
          size={20}
        />
      </Row>
      {variables.map(variable => (
        <VariableRow
          key={variable.key}
          variable={variable}
          updateVariable={updateVariable}
        />
      ))}
      {disabledVariables.map(([name, value]) => (
        <Row key={name} $desktopOnly>
          <NameInput type={'text'} value={name} disabled />
          <ValueInput type={'text'} value={value} disabled />
          <VariableButtonDisabled withPadding icon={IconType.LOCK} size={20} />
        </Row>
      ))}
    </>
  );
};
