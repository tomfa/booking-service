import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Wrapper } from './FileDrop.styles';

type Props = {
  title: string;
  onDrop: (files: File[]) => void;
  isLoading?: boolean;
};
export const FileDrop = ({
  title = 'Click or Drag and drop files here',
  onDrop,
  isLoading,
}: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    // @ts-ignore
    <Wrapper {...getRootProps()} highlighted={isDragActive} loading={isLoading}>
      <input {...getInputProps()} />
      <span>{isLoading ? 'Uploading...' : title}</span>
    </Wrapper>
  );
};
