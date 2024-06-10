import { FormattedNumber as Number } from 'react-intl';
import { Skeleton } from '../ui/skeleton';
import { CardHeader as CardHeaderSmall } from '../ui/smallCard';

export function Card({ padded = true, loading, error, className, children, ...props }) {
  if (error) {
    console.error(error);
    return (
      <div
      // css={css`
      // background: white;//rgb(224,87,51);
      // /* background: linear-gradient(175deg, rgba(224,87,51,1) 0%, rgba(239,106,70,1) 59%, rgba(255,126,90,1) 100%); */
      // /* color: white; */
      // border: 1px solid var(--paperBorderColor);
      // border-radius: var(--borderRadiusPx);
      // display: flex;
      // `}
      >
        <div
        // css={css`
        //   flex: 0 0 150px;
        //   padding: 24px;
        //   background: url('https://graphql.gbif.org/images/error.svg');
        //   background-repeat: no-repeat;
        //   background-position: 50% 50%;
        //   background-size: 150px;
        // `}
        ></div>
        <div
        // css={css`
        //   flex: 1 1 auto;
        //   padding: 24px;
        // `}
        >
          <h3>Error</h3>
          <p>The card could not be loaded. Please try again later or report the issue.</p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`gbif-card ${className ?? ''}`}
      // css={css`
      //   background: var(--paperBackground);
      //   ${padded ? paddedContent : null}
      //   border: 1px solid var(--paperBorderColor);
      //   border-radius: var(--borderRadiusPx);
      //   padding: 18px;
      //   display: block !important;
      //   position: relative;
      // `}
      {...props}
    >
      {loading && (
        <div
        // css={css`
        //   z-index: 1000;
        //   background: white;
        //   position: absolute;
        //   text-align: center;
        //   opacity: 0.8;
        //   top: 0;
        //   bottom: 0;
        //   left: 0;
        //   right: 0;
        // `}
        >
          loading
          {/* <EllipsisLoader active={true} 
        // css={css`
        //   top: 50%;
        //   transform: translateY(-50%);
        // `} 
        /> */}
        </div>
      )}
      {children}
    </div>
  );
}

export function CardHeader({ padded = true, options, children, ...props }) {
  return (
    <CardHeaderSmall className='g-flex' {...props}>
      <div className='g-flex'>
        <div className='g-flex-auto'>{children}</div>
        {options && <div className='g-flex-none'>
          <div>{options}</div>
        </div>}
      </div>
    </CardHeaderSmall>
  );
}

export function Table({ padded = true, removeBorder, ...props }) {
  return (
    <table
      className={`g-w-full g-mb-4 g-border-collapse [&_tr]:g-border-separate [&_tr]:g-border-spacing-0 
    [&_td]:g-py-1 [&_td]:g-px-2 ${removeBorder ? '[&_tr]:g-border-t-0' : '[&_tr]:g-border-t'}
    [&_td:first-of-type]:g-ps-0 [&_td:last-of-type]:g-pe-0
     `}
      {...props}
    ></table>
  );
}

export function BarItem({ children, percent = 0, ...props }) {
  return (
    <div
      className='g-relative'
    // css={css`position: relative;`}
    >
      <div
        className='g-absolute g-left-0 g-bg-primary g-opacity-20 g-rounded'
        style={{ width: `${percent}%`, height: '1.6em' }}
        // css={css`
        //   position: absolute;
        //   left: 0;
        //   width: ${percent}%;
        //   height: 1.6em;
        //   border-radius: var(--borderRadiusPx);
        //   background: var(--primary);
        //   opacity: .2;
        //   `}
        {...props}
      ></div>
      <div
      className='g-z-10 g-ms-1'
      // css={css`z-index: 1; margin-left: 6px;`}
      >
        {children}
      </div>
    </div>
  );
}

export function FormattedNumber(props) {
  if (typeof props?.value === 'undefined') return <Skeleton width="70px" />;
  return <Number {...props} />;
}
