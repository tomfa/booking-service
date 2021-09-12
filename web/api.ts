import { FileDataDTO, FOLDER } from '@vailable/shared';
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
}): Promise<{
  username?: string;
  apiKey?: string;
  message: string;
  error?: string;
  jwt?: string;
}> => {
  if (config.MOCK_API) {
    return {
      username,
      apiKey: password,
      message: 'Logged in',
    };
  }
  const response = await fetch(`${config.API_URL}/auth/login`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  const json = await response.json();
  if (json.error) {
    return { message: json.message, error: json.error };
  }
  if (json.message !== 'OK') {
    // TODO: Better error handling
    throw new Error(`Logging in ${username} failed: ${JSON.stringify(json)}`);
  }
  return json.data;
};

export const uploadFile = async (
  file: File,
  folder: FOLDER.templates | FOLDER.fonts,
  token: string
): Promise<{ success: boolean; data: FileDataDTO }> => {
  const fileName = file.name;
  const response = await fetch(
    `${config.API_URL}/${folder}/upload_url?name=${fileName}`,
    { headers: { authorization: `Bearer ${token}` } }
  );
  const { data } = await response.json();
  await performUpload({ file, url: data.uploadUrl });

  return {
    success: true,
    data: data.file,
  };
};

export const deleteFile = async (
  file: FileDataDTO,
  permanent: boolean,
  token: string
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
      headers: { authorization: `Bearer ${token}` },
    }
  );
  const json = await response.json();
  if (json.message !== 'OK') {
    // TODO: Better error handling
    throw new Error(`Deleting ${file.filename} failed`);
  }
};

export const listFiles = async (
  folder: FOLDER,
  token: string
): Promise<FileDataDTO[]> => {
  if (config.MOCK_API) {
    return [
      {
        id: 'da18cc94-c5b7-4dab-b7d5-9130f9e145b1',
        filename: 'dummy-file1.pdf',
        modified: '2021-03-21T08:18:50.000Z',
        url:
          'https://example.com/testuser/files/da18cc94-c5b7-4dab-b7d5-9130f9e145b1/dummy-file1.pdf',
        archived: false,
        owner: 'testuser',
        folder,
      },
      {
        id: 'da18cc94-c5b7-4dab-b7d5-9130f9e145b2',
        filename: 'dummy-file2.pdf',
        modified: '2021-03-21T08:19:30.000Z',
        url:
          'https://example.com/testuser/files/da18cc94-c5b7-4dab-b7d5-9130f9e145b2/dummy-file1.pdf',
        archived: false,
        owner: 'testuser',
        folder,
      },
      {
        id: 'da18cc94-c5b7-4dab-b7d5-9130f9e145b3',
        filename: 'dummy-file3.pdf',
        modified: '2021-03-21T08:20:51.000Z',
        url:
          'https://example.com/testuser/files/da18cc94-c5b7-4dab-b7d5-9130f9e145b3/dummy-file3.pdf.archived',
        archived: true,
        owner: 'testuser',
        folder,
      },
    ];
  }
  const response = await fetch(`${config.API_URL}/${folder}`, {
    headers: { authorization: `Bearer ${token}` },
  });
  const json = await response.json();
  return json.data.sort(
    (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime()
  );
};
