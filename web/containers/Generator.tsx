import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';
import { Code } from '../components/Code.styles';
import { IconType } from '../components/Icon';
import { copyToClipBoard } from '../components/utils/clipboard.utils';
import { usePDFGenerator } from '../providers/PDFProvider';
import { Button } from '../components/Button';
import { getFileNameFromVariables } from '../utils/files';
import { VariableEditor } from './VariableEditor';

export const Generator = () => {
  const theme = useTheme();
  const {
    selectedTemplate,
    variables,
    addVariable,
    generatedUrl,
    updateVariable,
  } = usePDFGenerator();
  const [hasCopied, setCopied] = useState<boolean>(false);
  const onCopy = useCallback(() => {
    copyToClipBoard([generatedUrl]);
    setCopied(true);
  }, [setCopied, generatedUrl]);
  useEffect(() => setCopied(false), [generatedUrl]);
  const fileName = useMemo(() => getFileNameFromVariables(variables), [
    variables,
  ]);

  return (
    <span className="card wide">
      <h2>Create PDF &rarr;</h2>
      {!selectedTemplate && <p>Select a template to start</p>}
      {selectedTemplate && (
        <>
          <Code>
            <a href={generatedUrl}>{generatedUrl}</a>
            <Button
              onClick={onCopy}
              style={{ alignSelf: 'flex-start' }}
              secondary
              icon={hasCopied ? IconType.CHECK : IconType.COPY}
              label={hasCopied ? 'Copied' : 'Copy'}
            />
          </Code>
          <p style={{ padding: '1rem 0' }}>
            Set variables to populate {`{{ placeholder }}`} text in file.
          </p>
          <VariableEditor
            variables={variables}
            onAddVariable={addVariable}
            updateVariable={updateVariable}
          />
          <small style={{ display: 'block', paddingTop: '0.5rem' }}>
            Filename will be set to{' '}
            <strong style={{ color: theme.colors.primary }}>
              {fileName || 'file.pdf'}
            </strong>
            .
            {!fileName && (
              <>
                {' '}
                This can be overriden with variables <em>
                  filename, title
                </em> or <em>name</em>, in that order.
              </>
            )}
          </small>
        </>
      )}
    </span>
  );
};
