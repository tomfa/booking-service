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

const uploadFile = async (file: File) => {
  const fileName = file.name;
  const response = await fetch(
    `${API_URL}/template/upload_url?name=${fileName}`,
  );
  const { url } = await response.json();
  await performUpload({ file, url });
};

export default uploadFile;
