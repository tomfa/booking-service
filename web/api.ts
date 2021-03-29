import { FileDataDTO, FOLDER } from '@pdf-generator/shared';
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

  // TODO: Return generated DTO from api or extract utils functions to shared
  return {
    success: true,
    data: {
      url: url.split('?')[0],
      filename: file.name,
      modified: 'Just now',
      archived: false,
      folder: type,
      owner: '',
      id: 'TODO',
    },
  };
};

export const deleteFile = async (file: FileDataDTO): Promise<void> => {
  const response = await fetch(
    `${config.API_URL}/${file.folder}/?files=${file.filename}`,
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

export const listFiles = async (folder: FOLDER): Promise<FileDataDTO[]> => {
  if (config.MOCK_API) {
    return [
      {
        id: 'da18cc94-c5b7-4dab-b7d5-9130f9e145b1',
        filename: 'dummy-file1.pdf',
        modified: '2021-03-21T08:18:50.000Z',
        url:
          'https://s3.eu-north-1.amazonaws.com/pdfs.webutvikling.org/testuser/files/da18cc94-c5b7-4dab-b7d5-9130f9e145b1/dummy-file1.pdf',
        archived: false,
        owner: 'testuser',
        folder,
      },
      {
        id: 'da18cc94-c5b7-4dab-b7d5-9130f9e145b2',
        filename: 'dummy-file2.pdf',
        modified: '2021-03-21T08:19:30.000Z',
        url:
          'https://s3.eu-north-1.amazonaws.com/pdfs.webutvikling.org/testuser/files/da18cc94-c5b7-4dab-b7d5-9130f9e145b2/dummy-file1.pdf',
        archived: false,
        owner: 'testuser',
        folder,
      },
      {
        id: 'da18cc94-c5b7-4dab-b7d5-9130f9e145b3',
        filename: 'dummy-file3.pdf',
        modified: '2021-03-21T08:20:51.000Z',
        url:
          'https://s3.eu-north-1.amazonaws.com/pdfs.webutvikling.org/testuser/files/da18cc94-c5b7-4dab-b7d5-9130f9e145b3/dummy-file3.pdf.archived',
        archived: true,
        owner: 'testuser',
        folder,
      },
    ];
  }
  const response = await fetch(`${config.API_URL}/${type}`);
  const json = await response.json();
  return json.data.sort(
    (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );
};
