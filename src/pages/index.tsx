import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <>
      <Head>
        <title>Posts | SpaceTraveling</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.postsContainer}>
          <Image
            src="/imgs/logo.png"
            alt="spacetraveling logo"
            width="236"
            height="25"
            priority
          />

          <div className={styles.postsInfo}>
            <Link href="/" passHref>
              <a>
                <strong className={styles.postTitle}>
                  Como utilizar Hooks
                </strong>
                <p className={styles.postSubtitle}>
                  Pensando em sincronização em vez de ciclos de vida
                </p>
                <div className={styles.postFooterInfo}>
                  <div>
                    <FiCalendar />
                    <time>15 Mar 2022</time>
                  </div>
                  <div>
                    <FiUser />
                    <address>Ryan Alencar</address>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');
  console.log(posts);
  return {
    props: {
      posts,
    },
  };
};
