import { useEffect, useState } from 'react';
import { classNames } from '@junipero/core';
import PropTypes from 'prop-types';

const Pagination = ({
  size,
  onPageChange,
  initialPage = 1,
  className,
}) => {
  const [activePage, setActivePage] = useState(initialPage);
  const [wasRenderedOnce, setWasRenderedOnce] = useState(false);

  useEffect(() => {
    if (wasRenderedOnce) {
      onPageChange(activePage);
    }
  }, [activePage]);

  const goToPrevious = () => {
    if (activePage > 1) {
      setActivePage(activePage - 1);
      setWasRenderedOnce(true);
    }
  };

  const goToNext = () => {
    if (activePage < size) {
      setActivePage(activePage + 1);
      setWasRenderedOnce(true);
    }
  };

  const goTo = page => {
    setActivePage(page);
    setWasRenderedOnce(true);
  };

  const createPageNumbersTags = () => {
    const pageNumbersTags = [];

    if (size < 8) {
      for (let i = 0; i < size; i++) {
        pageNumbersTags.push(
          <div
            key={i}
            onClick={() => goTo(i + 1)}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              `${i + 1 === activePage ? 'pagination-item-active' : ''}`,
            )}
          >
            {i + 1}
          </div>
        );
      }
    } else {
      if (activePage < 5) {
        for (let i = 0; i < 5; i++) {
          pageNumbersTags.push(
            <div
              key={i}
              onClick={() => goTo(i + 1)}
              className={classNames(
                'junipero',
                'pagination',
                'pagination-item',
                `${i + 1 === activePage ? 'pagination-item-active' : ''}`,
              )}
            >
              {i + 1}
            </div>
          );
        }

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
          </div>
        );

        pageNumbersTags.push(
          <div
            key={6}
            onClick={() => goTo(size)}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              `${size === activePage ? 'pagination-item-active' : ''}`,
            )}
          >
            {size}
          </div>
        );
      }

      if (activePage >= 5 && activePage <= size - 4) {
        pageNumbersTags.push(
          <div
            key={0}
            onClick={() => goTo(1)}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              `${activePage === 1 ? 'pagination-item-active' : ''}`,
            )}
          >
            {1}
          </div>
        );

        pageNumbersTags.push(
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
          </div>
        );

        for (let i = activePage - 1; i < activePage + 2; i++) {
          pageNumbersTags.push(
            <div
              key={i}
              onClick={() => goTo(i)}
              className={classNames(
                'junipero',
                'pagination',
                'pagination-item',
                `${i === activePage ? 'pagination-item-active' : ''}`,
              )}
            >
              {i}
            </div>
          );
        }

        pageNumbersTags.push(
          <div
            key={size - 1}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              'pagination-item-dots',
            )}
          >
            ...
          </div>
        );

        pageNumbersTags.push(
          <div
            key={size}
            onClick={() => goTo(size)}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              `${size === activePage ? 'pagination-item-active' : ''}`,
            )}
          >
            {size}
          </div>
        );
      }

      if (activePage > size - 4) {
        pageNumbersTags.push(
          <div
            key={0}
            onClick={() => goTo(1)}
            className={classNames(
              'junipero',
              'pagination',
              'pagination-item',
              `${activePage === 1 ? 'pagination-item-active' : ''}`,
            )}
          >
            {1}
          </div>
        );

        pageNumbersTags.push(
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
          </div>
        );

        for (let i = size - 4; i <= size; i++) {
          pageNumbersTags.push(
            <div
              key={i}
              onClick={() => goTo(i)}
              className={classNames(
                'junipero',
                'pagination',
                'pagination-item',
                `${i === activePage ? 'pagination-item-active' : ''}`,
              )}
            >
              {i}
            </div>
          );
        }
      }
    }

    return pageNumbersTags;
  };

  return (
    <div className={classNames('junipero', 'pagination', className)}>
      <i
        onClick={() => goToPrevious()}
        className={classNames(
          'junipero-icons',
          activePage === 1 ? 'previous-disabled' : 'previous',
        )}
      >
        expand_more
      </i>
      {createPageNumbersTags()}
      <i
        onClick={() => goToNext()}
        className={classNames(
          'junipero-icons',
          activePage === size ? 'next-disabled' : 'next',
        )}
      >
        expand_more
      </i>
    </div>
  );
};

Pagination.propTypes = {
  size: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  initialPage: PropTypes.number,
};

export default Pagination;