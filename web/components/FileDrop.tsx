import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import uploadFile from '../api/upload';
import { Wrapper } from './FileDrop.styles';

export const FileDrop = ({ title = 'Click or Drag and drop files here'}) => {
  const onDrop = useCallback(
    (droppedFiles: File[]) => droppedFiles.map(uploadFile),
    [],
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    // @ts-ignore
    <Wrapper {...getRootProps()}>
      <input {...getInputProps()} />
      <span>{title}</span>
    </Wrapper>
  );
};
