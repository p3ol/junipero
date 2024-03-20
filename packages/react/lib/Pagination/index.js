import { useReducer } from 'react';
import { classNames, mockState } from '@junipero/core';
import PropTypes from 'prop-types';

const Pagination = ({
  size,
  initialPage = 1,
  shouldWrap = true,
  shouldWrapFrom = 8,
  onPageChange,
  className,
}) => {
  const [state, dispatch] = useReducer(mockState, { activePage: initialPage });

  const goToPrevious = () => {
    if (state.activePage > 1) {
      dispatch({ activePage: state.activePage - 1 });
      onPageChange?.(state.activePage - 1);
    }
  };

  const goToNext = () => {
    if (state.activePage < size) {
      dispatch({ activePage: state.activePage + 1 });
      onPageChange?.(state.activePage + 1);
    }
  };

  const goTo = page => {
    if (!page) {
      throw new Error('Page number is required');
    }

    dispatch({ activePage: page });
    onPageChange?.(page);
  };

  const createPageNumbersTags = () => {
    if (!shouldWrap || size < shouldWrapFrom) {
      return Array.from({ length: size }).map((_, i) => {
        return (
          <div
            key={i}
            onClick={() => goTo(i + 1)}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              `${ i + 1 === state.activePage ? 'pagination-item-active' : '' }`,
            )}
          >
            {i + 1}
          </div>
        );
      });
    } else {
      if (state.activePage < 5) {
        const pageNumbersTags = Array.from({ length: 5 }).map((_, i) => {
          return (
            <div
              key={i}
              onClick={() => goTo(i + 1)}
              className={classNames(
                'junipero',
                'pagination',
                'pagination-item',
                `${i + 1 === state.activePage ? 'pagination-item-active' : ''}`,
              )}
            >
              {i + 1}
            </div>
          );
        });

        pageNumbersTags.push(
          <div
            key={5}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              'pagination-item-dots',
            )}
          >
            ...
          </div>,
          <div
            key={6}
            onClick={() => goTo(size)}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              `${size === state.activePage ? 'pagination-item-active' : ''}`,
            )}
          >
            {size}
          </div>
        );

        return pageNumbersTags;
      } else if (state.activePage <= size - 4) {
        const pageNumbersTags = [
          <div
            key={0}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              'pagination-item-dots',
            )}
          >
            ...
          </div>,
          <div
            key={1}
            onClick={() => goTo(1)}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              `${state.activePage === 1 ? 'pagination-item-active' : ''}`,
            )}
          >
            {1}
          </div>,
        ];

        [state.activePage - 1, state.activePage, state.activePage + 1]
          .forEach((page, i) => {
            pageNumbersTags.push(
              <div
                key={i + 2}
                onClick={() => goTo(page)}
                className={classNames(
                  'junipero',
                  'pagination',
                  'pagination-item',
                  `${
                    page === state.activePage
                      ? 'pagination-item-active'
                      : ''
                  }`,
                )}
              >
                {page}
              </div>
            );
          });

        pageNumbersTags.push(
          <div
            key={5}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              'pagination-item-dots',
            )}
          >
            ...
          </div>,
          <div
            key={6}
            onClick={() => goTo(size)}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              `${size === state.activePage ? 'pagination-item-active' : ''}`,
            )}
          >
            {size}
          </div>
        );

        return pageNumbersTags;
      } else {
        const pageNumbersTags = [
          <div
            key={1}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              'pagination-item-dots',
            )}
          >
            ...
          </div>,
          <div
            key={0}
            onClick={() => goTo(1)}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              `${state.activePage === 1 ? 'pagination-item-active' : ''}`,
            )}
          >
            {1}
          </div>,
        ];

        Array.from({ length: 5 }).map((_, i) => {
          return (
            <div
              key={i + 2}
              onClick={() => goTo(size - i)}
              className={classNames(
                'junipero',
                'pagination',
                'pagination-item',
                `${
                  size - i === state.activePage
                    ? 'pagination-item-active'
                    : ''
                }`,
              )}
            >
              {size - i}
            </div>
          );
        }).reverse().forEach(pageNumber => pageNumbersTags.push(pageNumber));

        return pageNumbersTags;
      }
    }
  };

  return (
    <div className={classNames('junipero', 'pagination', className)}>
      <i
        onClick={() => goToPrevious()}
        className={classNames(
          'junipero-icons',
          state.activePage === 1 ? 'previous-disabled' : 'previous',
        )}
      >
        expand_more
      </i>
      {createPageNumbersTags()}
      <i
        onClick={() => goToNext()}
        className={classNames(
          'junipero-icons',
          state.activePage === size ? 'next-disabled' : 'next',
        )}
      >
        expand_more
      </i>
    </div>
  );
};

Pagination.displayName = 'Pagination';
Pagination.propTypes = {
  size: PropTypes.number.isRequired,
  shouldWrap: PropTypes.bool,
  shouldWrapFrom: PropTypes.number,
  onPageChange: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
};

export default Pagination;
