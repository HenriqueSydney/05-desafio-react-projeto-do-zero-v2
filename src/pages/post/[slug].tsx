import { ReactElement } from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';

import { RichText } from 'prismic-dom';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';

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

export default function Post({ post }: PostProps): ReactElement {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }

  function calculateEstimatedReadingTime(): number {
    const totalWords = post.data.content.reduce((accWords, content) => {
      let postHeading = 0;
      let postBody = 0;

      if (content.heading) {
        postHeading = content.heading.trim().split(/\s+/).length;
      }

      if (RichText.asText(content.body)) {
        postBody = RichText.asText(content.body).trim().split(/\s+/).length;
      }

      return accWords + postHeading + postBody;
    }, 0);

    const wordsPerMinute = 200;

    return Math.ceil(totalWords / wordsPerMinute);
  }

  return (
    <>
      <Head>
        <title>{`${post.data.title} | Spacetraveling`}</title>
      </Head>

      <Header />

      <main>
        <div>
          <img
            src={post.data.banner.url}
            alt="banner"
            className={styles.banner}
          />
        </div>
        <section className={`${commonStyles.container} ${styles.container}`}>
          <div className={styles.title}>
            <h1>{post.data.title}</h1>
            <div className={commonStyles.authorAndDateContainer}>
              <div>
                <FiCalendar />
                <time>
                  {format(
                    new Date(post.first_publication_date),
                    'dd MMM yyyy',
                    {
                      locale: ptBR,
                    }
                  ).toLowerCase()}
                </time>
              </div>
              <div>
                <FiUser />
                <span>{post.data.author}</span>
              </div>
              <div>
                <FiClock />
                <span>{`${String(calculateEstimatedReadingTime())} min`} </span>
              </div>
            </div>
          </div>

          <div className={styles.content}>
            {post.data.content.map(({ heading, body }) => (
              <div key={heading} className={styles.postGroup}>
                <h2>{heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(body),
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {
    pageSize: 10,
  });

  const paths = posts.results.map(post => {
    return { params: { slug: post.uid } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient({});

  const response = await prismic.getByUID<any>('posts', String(slug), {});

  return {
    props: {
      post: response,
    },
    redirect: 60 * 30,
  };
};
