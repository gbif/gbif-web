
import { jsx } from '@emotion/react';
import React, { useContext, Component } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { MdLock, MdLockOpen, MdChevronRight, MdChevronLeft, MdFirstPage, MdMoreVert } from "react-icons/md";
import { Button } from '../Button';
import { Tooltip } from '../Tooltip/Tooltip';
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
      {toggle && <Tooltip title={<span><FormattedMessage id="search.table.lockColumn" defaultMessage="Lock column" /></span>} placement="auto">
        <Button appearance="text" onClick={toggle} style={{ display: 'flex', marginLeft: 5 }}>
          {locked ? <MdLock /> : <MdLockOpen />}
        </Button>
      </Tooltip>}
    </div>
  </th>
);

export const Td = ({ children, width, noWrap, ...rest }) => (
  <td {...rest}>
    <span css={styles.dataCell({width, noWrap})}>{children}</span>
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
    const { intl, loading, theme, children, first, prev, next, size, from, total, fixedColumn, style, ...props } = this.props;

    const page = 1 + Math.floor(from / size);
    const totalPages = Math.ceil(total / size);
    return (
      <React.Fragment>
        <div css={styles.wrapper({ theme })} style={style} {...props}>
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
          {next && <div css={styles.footer({ theme })}>
            {first && page > 2 && <Button appearance="text" css={styles.footerItem({ theme })} direction="right" tip={intl.formatMessage({id: 'pagination.first'})} onClick={first}>
              <MdFirstPage />
            </Button>}
            {prev && page > 1 && <Button appearance="text" css={styles.footerItem({ theme })} direction="right" tip={intl.formatMessage({id: 'pagination.previous'})} onClick={prev}>
              <MdChevronLeft />
            </Button>}
            {total > 0 && <span css={styles.footerText({ theme })}>
              <FormattedMessage
                id='pagination.pageXofY'
                defaultMessage={'Loading'}
                values={{ current: <FormattedNumber value={page} />, total: <FormattedNumber value={totalPages} /> }}
              />
            </span>}
            {next && page < totalPages && <Button appearance="text" css={styles.footerItem({ theme })} direction="left" tip={intl.formatMessage({id: 'pagination.next'})} onClick={next}>
              <MdChevronRight />
            </Button>}
            {/* <Button appearance="text" css={styles.footerItem()} direction="left" tip="options">
              <MdMoreVert />
            </Button> */}
          </div>}
        </div>
      </React.Fragment>
    );
  }
}

export function DataTable(props) {
  const theme = useContext(ThemeContext)
  const intl = useIntl();
  return <DataTableCore theme={theme} intl={intl} {...props} />
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
