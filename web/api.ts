import { FileDataDTO } from '@pdf-generator/shared';

// TODO: Get from config
const API_URL = 'http://localhost:3000';

const performUpload = ({ file, url }: { file: File; url: string }) =>
  new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve();
      }
    };
    xhr.onerror = () => {
      reject();
    };
    xhr.send(file);
  });

export const uploadFile = async (
  file: File,
  type: 'template' | 'font'
): Promise<{ success: boolean; data: FileDataDTO }> => {
  const fileName = file.name;
  const response = await fetch(
    `${API_URL}/${type}/upload_url?name=${fileName}`
  );
  const { url } = await response.json();
  await performUpload({ file, url });
  return {
    success: true,
    data: { url: url.split('?')[0], filename: file.name, modified: 'Just now' },
  };
};

export const listFiles = async (
  type: 'file' | 'template' | 'font'
): Promise<FileDataDTO[]> => {
  const response = await fetch(`${API_URL}/${type}`);
  const json = await response.json();
  return json.data;
};
