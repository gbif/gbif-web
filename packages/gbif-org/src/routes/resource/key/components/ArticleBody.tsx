import { cn } from '@/utils/shadcn';
import styles from './ArticleBody.module.css';

type Props = {
  className?: string;
  dangerouslySetInnerHTML: { __html: string };
};

export function ArticleBody({ className, dangerouslySetInnerHTML }: Props) {
  return (
    <div
      className={cn('prose m-auto', styles.container, className)}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  );
}
