import { PrismicRichText } from '@prismicio/react';
import { RichText } from 'prismic-dom';
import { format, parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  const { data, first_publication_date } = post;

  const wordsCount = data.content.reduce((sum, contentItem) => {
    sum += contentItem?.heading?.split(' ').length ?? 0;

    const words = contentItem?.body?.map(
      item => item.text.split(' ').length ?? 0
    );

    words.map(word => {
      sum += word;
      return null;
    });
    return sum;
  }, 0);

  const estimateReading = Math.ceil(wordsCount / 200);

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <Head>
        <title>{data.title} | SpaceTraveling</title>
      </Head>
      <Header />
      <main className={styles.container}>
        {data.banner && data.banner.url && (
          <section className={`${styles.mHero} ${styles.withPicture}`}>
            <div className={`${styles.mHeroPicture} ${styles.inPost}`}>
              <Image src={data.banner.url} alt="post banner" layout="fill" />
            </div>
          </section>
        )}
        <article className={styles.post}>
          <h1>{data.title}</h1>
          <div className={styles.articleInfo}>
            <div>
              <FiCalendar />
              <time>
                {format(parseISO(first_publication_date), 'dd LLL yyyy')}
              </time>
            </div>
            <div>
              <FiUser />
              <address>{post.data.author}</address>
            </div>
            <div>
              <FiClock />
              <address>{estimateReading} min</address>
            </div>
          </div>

          {post.data.content.map(content => {
            return (
              <section key={content.heading}>
                <h2>{content.heading}</h2>
                <div
                  className={styles.postContent}
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </section>
            );
          })}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');
  return {
    paths: posts.results.map(post => ({ params: { slug: post.uid } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const post = await prismic.getByUID('posts', String(params.slug));

  return {
    props: { post },
    revalidate: 60 * 30,
  };
};
