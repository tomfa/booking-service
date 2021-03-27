import Head from 'next/head';
import { useEffect } from 'react';
import { FileList } from '../components/FileList/FileList';
import { FileDrop } from '../components/FileDrop';
import { useTheme } from '../styles/theme';
import { useAuth } from '../providers/AuthProvider';
import { useData } from '../providers/DataProvider';

export default function Home() {
  const theme = useTheme();
  const auth = useAuth();
  const {
    fetchData,
    templates,
    files,
    fonts,
    uploadTemplates,
    uploadFonts,
    isFetching,
    isUploadingTemplates,
    isUploadingFonts,
  } = useData();
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <div className="container">
      <Head>
        <title>PDF Generator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">PDF generator {auth.username}</h1>

        <div className="grid">
          <span className="card">
            <h2>Templates</h2>
            <FileDrop
              title={'Upload new template'}
              onDrop={uploadTemplates}
              isLoading={isUploadingTemplates}
            />

            <FileList files={templates} isLoading={isFetching} />
          </span>

          <span className="card">
            <h2>Fonts</h2>
            <FileDrop
              title={'Upload new fonts'}
              onDrop={uploadFonts}
              isLoading={isUploadingFonts}
            />
            <FileList files={fonts} isLoading={isFetching} />
          </span>

          <span className="card wide">
            <h2>Create &rarr;</h2>
            <p>Select a template</p>
          </span>

          <span className="card wide">
            <h2>Generated PDFs</h2>
            <FileList files={files} isLoading={isFetching} />
          </span>
        </div>
      </main>

      <style>
        {`
          h1 {
            color: ${theme.colors.primary};
          }
        
          h2 {
            padding-bottom: 0.5rem;
            border-bottom: 1px solid ${theme.colors.primary};
          }
        
          .container {
            min-height: 100vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          main {
            padding: 5rem 0;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }

          footer {
            width: 100%;
            height: 100px;
            border-top: 1px solid #eaeaea;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          footer img {
            margin-left: 0.5rem;
          }

          footer a {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          .title a {
            color: #0070f3;
            text-decoration: none;
          }

          .title a:hover,
          .title a:focus,
          .title a:active {
            text-decoration: underline;
          }

          .title {
            margin: 0;
            line-height: 1.15;
            font-size: 4rem;
          }

          .title,
          .description {
            text-align: center;
          }

          .description {
            line-height: 1.5;
            font-size: 1.5rem;
          }

          code {
            background: #fafafa;
            border-radius: 5px;
            padding: 0.75rem;
            font-size: 1.1rem;
            font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          }

          .grid {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            flex-wrap: wrap;

            max-width: 800px;
            margin-top: 3rem;
          }

          .card {
            margin: 1rem;
            flex-basis: 95%;
            padding: 1.5rem;
            text-align: left;
            color: inherit;
            text-decoration: none;
            transition: color 0.15s ease, border-color 0.15s ease;
          }
          
          .card.wide {
            flex-basis: 95%;
          }

          .card h3 {
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
          }

          .card p {
            margin: 0;
            font-size: 1.25rem;
            line-height: 1.5;
          }

          .logo {
            height: 1em;
          }

          @media (max-width: 600px) {
            .grid {
              width: 100%;
              flex-direction: column;
            }
          }
        `}
      </style>
    </div>
  );
}
