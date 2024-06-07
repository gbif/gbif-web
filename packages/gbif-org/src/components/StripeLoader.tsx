// export const loading = keyframes
//   from {
//     left: -200,
//     width: 30% 
//   }
//   50% {
//     width: 30%
//   }
//   70% {
//     width: 70%
//   }
//   80% {
//     left: 50%
//   }
//   95% {
//     left: 120%
//   }
//   to {
//     left: 100%
//   }
// `;

import { cn } from "@/utils/shadcn"
import styles from './stripeLoader.module.css';

// const errorStyle = theme => css`
//   background-color: tomato;
//   left: 0;
//   animation: none;
//   width: 100%;
// `;

// const before = ({ error, theme }) => css`
//   display: block;
//   position: absolute;
//   content: '';
//   left: -200px;
//   width: 200px;
//   height: 1px;
//   background-color: ${theme.primary};
//   animation: ${loading} 1.5s linear infinite;
//   ${error ? errorStyle(theme) : null}
// `;

export default function StripeLoader({ active, error, className, ...props }: {
  active?: boolean,
  error?: boolean,
  className?: string
}) {
  
  return <div 
    // className={cn('g-h-px g-w-full g-relative g-overflow-hidden before:g-block before:g-absolute before:content-'' before:left--200 before:w-200 before:h-px before:bg-primary before:animation-loading before:infinite before:linear", className)}
    className={cn(styles.loader, (active && !error) ? styles.active : '', error ? styles.error : '', className)}
    // css={css`
    // height: 1px;
    // width: 100%;
    // position: relative;
    // overflow: hidden;
    // &:before {
    //   ${active ? before({ error, theme }) : null}
    // }`}
    ></div>
}