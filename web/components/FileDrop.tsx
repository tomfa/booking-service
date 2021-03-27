import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Wrapper } from './FileDrop.styles';

type Props = {
  title: string;
  onDrop: (files: File[]) => void;
  mimeTypes?: string[];
  isLoading?: boolean;
};
export const FileDrop = ({
  title = 'Click or Drag and drop files here',
  onDrop,
  isLoading,
  mimeTypes = [],
}: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    // @ts-ignore
    <Wrapper {...getRootProps()} highlighted={isDragActive} loading={isLoading}>
      <input {...getInputProps()} accept={mimeTypes.join(',')} />
      <span>{isLoading ? 'Uploading...' : title}</span>
    </Wrapper>
  );
};
