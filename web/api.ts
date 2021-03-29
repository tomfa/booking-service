import { FileDataDTO } from '@pdf-generator/shared';
import { config } from './config';

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
    `${config.API_URL}/${type}/upload_url?name=${fileName}`
  );
  const { url } = await response.json();
  await performUpload({ file, url });
  return {
    success: true,
    data: { url: url.split('?')[0], filename: file.name, modified: 'Just now' },
  };
};

export const getFileType = ({
  filename,
  url,
}: FileDataDTO): 'file' | 'font' | 'template' => {
  // TODO: ... Add type to FileDataDTO?
  const type = url.split(filename)[0].split('/').reverse()[1];
  return type.substr(0, type.length - 1) as 'file' | 'font' | 'template';
};

export const deleteFile = async (file: FileDataDTO): Promise<void> => {
  const response = await fetch(
    `${config.API_URL}/${getFileType(file)}/?files=${file.filename}`,
    {
      method: 'DELETE',
    }
  );
  const json = await response.json();
  if (json.message !== 'OK') {
    // TODO: Better error handling
    throw new Error(`Deleting ${file.filename} failed`);
  }
};

export const listFiles = async (
  type: 'file' | 'template' | 'font'
): Promise<FileDataDTO[]> => {
  if (config.MOCK_API) {
    return [
      {
        filename: 'da18cc94-c5b7-4dab-b7d5-9130f9e145b2.pdf',
        modified: '2021-03-21T08:18:50.000Z',
        url:
          'https://s3.eu-north-1.amazonaws.com/pdfs.webutvikling.org/files/da18cc94-c5b7-4dab-b7d5-9130f9e145b2.pdf',
      },
      {
        filename: 'b8057175-e743-47f4-b79b-e152b5d3dadc.pdf',
        modified: '2021-03-20T18:16:22.000Z',
        url:
          'https://s3.eu-north-1.amazonaws.com/pdfs.webutvikling.org/files/b8057175-e743-47f4-b79b-e152b5d3dadc.pdf',
      },
      {
        filename: '98a22657-b72c-4856-bb7d-1fa660732853.pdf',
        modified: '2021-03-20T17:59:04.000Z',
        url:
          'https://s3.eu-north-1.amazonaws.com/pdfs.webutvikling.org/files/98a22657-b72c-4856-bb7d-1fa660732853.pdf',
      },
    ];
  }
  const response = await fetch(`${config.API_URL}/${type}`);
  const json = await response.json();
  return json.data.sort(
    (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );
};
