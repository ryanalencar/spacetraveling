import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

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
  posts: PostPagination;
}

export default function Home({ posts }: HomeProps) {
  console.log(posts);

  return (
    <>
      <Head>
        <title>Posts | SpaceTraveling</title>
      </Head>
      <main className={commonStyles.container}>
        <div className={styles.postsContainer}>
          <Image
            src="/imgs/logo.png"
            alt="logo"
            width="236"
            height="25"
            priority
          />

          <div className={styles.postsInfo}>
            {posts.results.map(post => (
              <Link href={`/post/${post.uid}`} passHref>
                <a>
                  <strong className={styles.postTitle}>
                    {post.data.title}
                  </strong>
                  <p className={styles.postSubtitle}>{post.data.subtitle}</p>
                  <div className={styles.postFooterInfo}>
                    <div>
                      <FiCalendar />
                      <time>
                        {format(
                          parseISO(post.first_publication_date),
                          'dd LLL yyyy'
                        )}
                      </time>
                    </div>
                    <div>
                      <FiUser />
                      <address>{post.data.author}</address>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');

  // const postsFormatted = posts.results.map(post => ({
  //   slug: post.uid ?? '',
  //   title: post.data.title,
  //   subtitle: post.data.subtitle,
  //   author: post.data.author,
  //   updatedAt: format(parseISO(post.last_publication_date), 'dd LLL yyyy'),
  // }));

  // posts.results = postsFormatted;

  console.log(posts);
  return {
    props: {
      posts,
    },
  };
};
