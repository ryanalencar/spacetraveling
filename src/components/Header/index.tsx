import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" passHref>
        <a>
          <Image
            src="/imgs/logo.png"
            alt="logo"
            width="236"
            height="25"
            priority
          />
        </a>
      </Link>
    </header>
  );
}
