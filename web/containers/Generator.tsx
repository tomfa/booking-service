import { useCallback, useEffect, useState } from 'react';
import { Code } from '../components/Code.styles';
import { IconType } from '../components/Icon';
import { copyToClipBoard } from '../components/utils/clipboard.utils';
import { MessageType, useMessage } from '../providers/MessageProvider';
import { usePDFGenerator } from '../providers/PDFProvider';
import { Button } from '../components/Button';

export const VariableEditor = ({ variable, updateVariable }: {
  updateVariable: (name: string, value: string) => void;
  variables: Record<string, string>;
}) => {
  return (
    <p>TODO: Update variables here</p>
  )
}

export const Generator = () => {
  const {
    selectedTemplate,
    variables,
    updateVariable,
    generatedUrl,
  } = usePDFGenerator();
  const { addMessage } = useMessage();
  const [hasCopied, setCopied] = useState<boolean>(false);
  const onCopy = useCallback(() => {
    copyToClipBoard([generatedUrl]);
    setCopied(true);
    addMessage({
      title: `URL copied to clipboard`,
      type: MessageType.SUCCESS,
    });
  }, [addMessage, generatedUrl]);
  useEffect(() => setCopied(false), [generatedUrl]);
  return (
    <span className="card wide">
      <h2>Create PDF &rarr;</h2>
      {!selectedTemplate && <p>Select a template to start</p>}
      {selectedTemplate && (
        <>
          <h4>Variables</h4>
          <VariableEditor variables={variables} updateVariable={updateVariable} />
          <h4>URL</h4>
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
        </>
      )}
    </span>
  );
};
