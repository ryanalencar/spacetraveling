import { GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';

import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
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
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  const handleLoadMorePosts = async () => {
    const responseFetch = await fetch(nextPage).then(response =>
      response.json()
    );
    const { results, next_page: fetchedNextPage } = responseFetch;

    const fetchedPosts = results.map((post: Post) => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    const updatedPosts = [...posts, ...fetchedPosts];

    setPosts(updatedPosts);
    setNextPage(fetchedNextPage);
  };

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
            {posts?.map(post => (
              <Link key={post.uid} href={`/post/${post.uid}`} passHref>
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
                          new Date(post.first_publication_date),
                          'dd MMM yyyy',
                          {
                            locale: ptBR,
                          }
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
          {nextPage && (
            <button
              type="button"
              onClick={handleLoadMorePosts}
              className={styles.loadPostsButton}
            >
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByType('posts', {
    pageSize: 3,
    fetch: ['publication.title', 'publication.content'],
  });

  const { next_page, results: posts } = response;

  const results = posts.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: { next_page, results },
    },
  };
};
