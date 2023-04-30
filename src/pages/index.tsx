import { ReactElement, useState } from 'react';
import { GetStaticProps } from 'next';

import Head from 'next/head';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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

export default function Home({ postsPagination }: HomeProps): ReactElement {
  const [posts, setPosts] = useState<PostPagination>(postsPagination);

  async function handleLoadMorePosts(): Promise<void> {
    await fetch(postsPagination.next_page)
      .then(response => response.json())
      .then(data => {
        setPosts(prevPosts => ({
          next_page: data.next_page,
          results: [...prevPosts.results, ...data.results],
        }));
      })
      .catch(err => {
        alert(`An unexpected error has occurred. ${err.message}`);
      });
  }

  return (
    <>
      <Head>
        <title>Posts | spacetraveling</title>
      </Head>

      <main className={`${styles.container} ${commonStyles.container}`}>
        <div>
          <img src="/images/Logo.png" alt="Space Traveling logo" />
        </div>
        <div className={styles.posts}>
          {posts.results.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <a>
                <div>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
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
                  </div>
                </div>
              </a>
            </Link>
          ))}

          {posts.next_page !== null && (
            <button
              type="button"
              className={styles.loadMore}
              onClick={handleLoadMorePosts}
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
  const postsResponse = await prismic.getByType('posts', {
    pageSize: 2,
  });

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
      first_publication_date: post.first_publication_date,
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
    redirect: 60 * 30,
  };
};
