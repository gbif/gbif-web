/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useContext, Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { MdLock, MdLockOpen, MdChevronRight, MdChevronLeft, MdFirstPage, MdMoreVert } from "react-icons/md";
import { Button } from '../Button';
import { Skeleton } from '../Skeleton';
import * as styles from './styles';
import ThemeContext from '../../style/themes/ThemeContext';

export const TBody = ({ loading, columnCount, rowCount, ...props }) => {
  const theme = useContext(ThemeContext);
  // if not loading, then simply show the content as is
  if (!loading) return <tbody {...props} />;
  // if loading and there is already content in the table, then display that content in a skeleton style.
  // content that do not support this styling, will have to manage their own load style.
  if (React.Children.count(props.children) > 0) {
    return <tbody {...props} css={styles.tbodyLoading({theme})} />
  }
  // if loading and there is no content in the table, then display a bunch of skeleton rows
  return <tbody {...props}>
    {Array(rowCount || 10).fill().map((e, i) => {
      return <tr key={i}>
        {Array(columnCount || 5).fill().map((e, i) => <td key={i}><Skeleton /></td>)}
      </tr>
    })}
  </tbody>
}
TBody.propTypes = {
  loading: PropTypes.bool,
  columnCount: PropTypes.number,
  rowCount: PropTypes.number
}

export const Th = ({ children, width, toggle, locked, ...rest }) => (
  <th {...rest}>
    <div style={{ display: 'flex', alignItems: 'center', wrap: 'no-wrap' }} css={styles[width] ? styles[width]() : ''}>
      <div style={{ flex: '1 1 auto' }}>
        {children}
      </div>
      {toggle && <Button appearance="text" onClick={toggle} style={{ display: 'flex', marginLeft: 5 }}>
        {locked ? <MdLock /> : <MdLockOpen />}
      </Button>}
    </div>
  </th>
);

export const Td = ({ children, width, ...rest }) => (
  <td {...rest}>
    <span css={styles[width] ? styles[width]() : ''}>{children}</span>
  </td>
);

class DataTableCore extends Component {
  constructor(props) {
    super(props);

    this.bodyScroll = this.bodyScroll.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);

    this.myRef = React.createRef();
    this.state = {};
  }

  componentDidUpdate(prevProps) {
    if (prevProps.loading !== this.props.loading) {
      this.scrollToTop();
    }
  }

  bodyScroll() {
    // const nearEnd = Math.abs(this.myRef.current.offsetWidth + this.myRef.current.scrollLeft - this.myRef.current.scrollWidth) < 20;
    this.setState({ scrolled: this.myRef.current.scrollLeft !== 0 });
  }

  scrollToTop() {
    this.myRef.current.scrollTop = 0;
  }

  render() {
    const { theme, children, first, prev, next, size, from, total, fixedColumn, style } = this.props;

    const page = 1 + Math.floor(from / size);
    const totalPages = Math.ceil(total / size);
    return (
      <React.Fragment>
        {/* <div>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(x => x * 100).map(x => <div key={x} css={styles.paper({ theme, color: x })} style={{ width: 100, height: 100 }}>
            <div key={x} css={styles.ink({ theme, color: x })}>
              {x}
            </div>
          </div>)}
        </div> */}
        <div css={styles.wrapper({ theme })} style={style}>
          <div
            css={styles.occurrenceTable({ theme })}
            onScroll={this.bodyScroll}
            ref={this.myRef}
          >
            <table
              css={styles.table({ theme, stickyColumn: fixedColumn, scrolled: this.state.scrolled && fixedColumn })}
            >
              {children}
            </table>
          </div>
          <div css={styles.footer({ theme })}>
            {page > 2 && <Button appearance="text" css={styles.footerItem({ theme })} direction="right" tip="first" onClick={first}>
              <MdFirstPage />
            </Button>}
            {page > 1 && <Button appearance="text" css={styles.footerItem({ theme })} direction="right" tip="previous" onClick={prev}>
              <MdChevronLeft />
            </Button>}
            <span css={styles.footerText({ theme })}>
              <FormattedMessage
                id='pagination.pageXofY'
                defaultMessage={'Loading'}
                values={{ current: <FormattedNumber value={page} />, total: <FormattedNumber value={totalPages} /> }}
              />
            </span>
            {page !== totalPages && <Button appearance="text" css={styles.footerItem({ theme })} direction="left" tip="next" onClick={next}>
              <MdChevronRight />
            </Button>}
            {/* <Button appearance="text" css={styles.footerItem()} direction="left" tip="options">
              <MdMoreVert />
            </Button> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export function DataTable(props) {
  const theme = useContext(ThemeContext)
  return <DataTableCore theme={theme} {...props} />
}

DataTable.propTypes = {
  children: PropTypes.any,
  first: PropTypes.func,
  prev: PropTypes.func,
  next: PropTypes.func,
  size: PropTypes.number,
  from: PropTypes.number,
  total: PropTypes.number,
  fixedColumn: PropTypes.bool,
  style: PropTypes.object
}
