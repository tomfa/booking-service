import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import uploadFile from '../api/upload';
import { Wrapper } from './FileDrop.styles';

export const FileDrop = () => {
  const onDrop = useCallback(
    (droppedFiles: File[]) => droppedFiles.map(uploadFile),
    [],
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <Wrapper {...getRootProps()}>
      <input {...getInputProps()} />
      <span>Click or Drag and drop files here</span>
    </Wrapper>
  );
};
