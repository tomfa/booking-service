import { FileDataDTO, FOLDER, utils } from '@pdf-generator/shared';
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

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<{ username: string; apiKey: string } | null> => {
  if (config.MOCK_API) {
    return {
      username,
      apiKey: password,
    };
  }
  const response = await fetch(`${config.API_URL}/auth/login`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  if (response.status === 401) {
    return null;
  }
  const json = await response.json();
  if (json.message !== 'OK') {
    // TODO: Better error handling
    throw new Error(`Logging in ${username} failed`);
  }
  return json.data as { username: string; apiKey: string };
};

export const uploadFile = async (
  file: File,
  folder: FOLDER.templates | FOLDER.fonts
): Promise<{ success: boolean; data: FileDataDTO }> => {
  const fileName = file.name;
  const response = await fetch(
    `${config.API_URL}/${folder}/upload_url?name=${fileName}`
  );
  const { url } = await response.json();
  await performUpload({ file, url });

  const data = utils.getFileDataFromUrl(url);

  return {
    success: true,
    data,
  };
};

export const deleteFile = async (
  file: FileDataDTO,
  permanent: boolean
): Promise<void> => {
  if (config.MOCK_API) {
    return;
  }
  // TODO: Is this a bug? Should we avoid encoding the "/" there?
  const fileKey = encodeURIComponent(
    `${file.id}/${file.filename}${file.archived ? '.archived' : ''}`
  );
  const response = await fetch(
    `${config.API_URL}/${file.folder}/?files=${fileKey}&permanent=${permanent}`,
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
  const response = await fetch(`${config.API_URL}/${folder}`);
  const json = await response.json();
  return json.data.sort(
    (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );
};
