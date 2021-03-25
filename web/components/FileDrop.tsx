import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Wrapper } from './FileDrop.styles';

type Props = {
  title: string;
  onDrop: (files: File[]) => void;
};
export const FileDrop = ({
  title = 'Click or Drag and drop files here',
  onDrop,
}: Props) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    // @ts-ignore
    <Wrapper {...getRootProps()}>
      <input {...getInputProps()} />
      <span>{title}</span>
    </Wrapper>
  );
};
