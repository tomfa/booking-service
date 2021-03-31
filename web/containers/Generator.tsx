import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';
import { Code } from '../components/Code.styles';
import { IconType } from '../components/Icon';
import { copyToClipBoard } from '../components/utils/clipboard.utils';
import { usePDFGenerator } from '../providers/PDFProvider';
import { Button } from '../components/Button';
import { getFileNameFromVariables } from '../utils/files';
import { Card } from '../components/Card.styles';
import { LineHeader } from '../components/LineHeader';
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
    <Card>
      <LineHeader icon={IconType.COGWHEEL} header={'Create PDF'} hideButton />
      {!selectedTemplate && <p>Select a template to start</p>}
      {selectedTemplate && selectedTemplate.archived && (
        <p>Restore template to use it.</p>
      )}
      {selectedTemplate && !selectedTemplate.archived && (
        <>
          <p style={{ padding: '0 0 0.5rem' }}>
            Set variables to populate <small>{`{{ placeholder }}`}</small> text
            in file.
          </p>
          <VariableEditor
            variables={variables}
            onAddVariable={addVariable}
            updateVariable={updateVariable}
          />
          <small
            style={{
              display: 'block',
              paddingTop: '0.5rem',
              paddingBottom: '1rem',
            }}>
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
          <Code>
            <a href={generatedUrl}>{generatedUrl}</a>
            <Button
              onClick={onCopy}
              style={{ alignSelf: 'flex-start', marginTop: '1rem' }}
              secondary
              icon={hasCopied ? IconType.CHECK : IconType.COPY}
              label={hasCopied ? 'Copied' : 'Copy'}
            />
          </Code>
        </>
      )}
    </Card>
  );
};
