type FileData = { url: string }
export const storeFile = async (content: Buffer): Promise<FileData> => {
  // TODO: Store content as something
  return { url: 'https://vg.no' }
}
