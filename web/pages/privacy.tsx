import { H1 } from '../components/H1.styles';
import { Main } from '../components/Main.styles';
import { LogoIcon } from '../components/LogoIcon';
import { Layout } from '../components/Layout';

export default function PrivacyPage() {
  return (
    <Layout social={{ title: 'Vailable | Privacy' }}>
      <Main>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}>
          <LogoIcon size={'200px'} />
        </div>
        <H1>Privacy</H1>
        <h3>Account</h3>
        <p>
          Account is created on invitation only basis. It consists of your email
          only.
        </p>
        <p>We use your email for three purposes:</p>
        <ul>
          <li>Login and resetting of the password.</li>
          <li>To notify you if we change the privacy policy.</li>
          <li>To notify you if you are affected by any issues.</li>
        </ul>
        <h3>Cookies</h3>
        <p>
          Cookies are only used to store your authentication data. This is
          required for the site to function.
        </p>
        <h3>Analytics</h3>
        <p>
          DocForest uses no analytics tools for marketing, nor user behavior.
        </p>
        <h3>Storage</h3>
        <p>
          Data is stored on AWS S3 buckets and Aurora Serverless databases
          located in Stockholm, Sweden.
        </p>
        <h3>Data processing</h3>
        <p>
          Processing and generating documents happens in temporary AWS Lambda
          functions, performed in Stockholm, Sweden.
        </p>
        <p>
          During processing, logs are generated that can determine your usage of
          the service, along with your IP address. We only use this data to
          investigate and resolve errors.
        </p>
      </Main>
    </Layout>
  );
}
