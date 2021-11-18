import { LogoIcon } from '../components/LogoIcon';
import { Layout } from '../components/Layout';

export default function PrivacyPage() {
  return (
    <Layout social={{ title: 'Vailable | Privacy' }}>
      <main>
        <div className={'w-full flex justify-center'}>
          <LogoIcon size={'200px'} />
        </div>
        <h1 className={'text-3xl mb-4'}>Privacy</h1>
        <h3 className={'text-xl mb-2 mt-6'}>Account</h3>
        <p>
          Account is created on invitation only basis. It consists of your email
          only.
        </p>
        <p>We use your email for three purposes:</p>
        <ul className={'mb-2 mt-4'}>
          <li className={'pl-4'}>- Login and resetting of the password.</li>
          <li className={'pl-4'}>
            - To notify you if we change the privacy policy.
          </li>
          <li className={'pl-4'}>
            - To notify you if you are affected by any issues.
          </li>
        </ul>
        <h3 className={'text-xl mb-2 mt-6'}>Cookies</h3>
        <p>
          Cookies are only used to store your authentication data. This is
          required for the site to function.
        </p>
        <h3 className={'text-xl mb-2 mt-6'}>Analytics</h3>
        <p>
          Vailable uses no analytics tools for marketing, nor user behavior.
        </p>
        <h3 className={'text-xl mb-2 mt-6'}>Storage</h3>
        <p>Data is stored in Googles Firebase, located in Europe.</p>
        <h3 className={'text-xl mb-2 mt-6'}>Data processing</h3>
        <p>
          Processing and generating documents happens in temporary Google Cloud
          Functions, performed in Europe.
        </p>
        <p>
          During processing, logs are generated that can determine your usage of
          the service, along with your IP address. We only use this data to
          investigate and resolve errors.
        </p>
      </main>
    </Layout>
  );
}
