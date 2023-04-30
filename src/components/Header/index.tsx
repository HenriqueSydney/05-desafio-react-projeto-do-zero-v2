import { ReactElement } from 'react';

import Link from 'next/link';

import styles from './header.module.scss';

export default function Header(): ReactElement {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Link href="/">
          <img src="/images/Logo.png" alt="logo" />
        </Link>
      </div>
    </div>
  );
}
