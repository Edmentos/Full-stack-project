import '../styles/globals.css'
import Layout from '../components/layout/Layout'
import { MeetupContextProvider } from '../context/MeetupContext'

function MyApp({ Component, pageProps }) {
  return (
    <MeetupContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </MeetupContextProvider>
  );
}

export default MyApp
