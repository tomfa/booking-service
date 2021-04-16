import Head from 'next/head';
import { useRouter } from 'next/router';
import { config } from '../../config';

export type SocialTags = {
  title?: string;
  description?: string;
  imagePath?: string;
};
const DEFAULT_TITLE = 'DocForest | PDF generator';
const DEFAULT_DESCRIPTION = 'Generate docs from API using custom templates';
const DEFAULT_IMAGE_PATH = 'social.jpg';

const Meta = (props: SocialTags) => {
  const router = useRouter();
  const title = props.title || DEFAULT_TITLE;
  const description = props.description || DEFAULT_DESCRIPTION;
  const baseUrl = router.basePath
    ? `${config.WEB_URL}/${router.basePath}`
    : config.WEB_URL;
  const url = router.asPath ? `${baseUrl}/${router.asPath}` : baseUrl;
  const imageUrl = `${baseUrl}/${props.imagePath || DEFAULT_IMAGE_PATH}`;
  return (
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Head>
  );
};

export default Meta;
