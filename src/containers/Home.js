import React, { useEffect, useState } from 'react';
import { Input } from 'widgets';
import styles from './Home.css';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { isEmpty, get, times } from 'lodash-es';

const Home = () => {
  const { getSearchResults, resetSearchResults } = useStoreActions(action => action.search);
  const { searchResults, totalPages } = useStoreState(state => state.search);
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  }, []);

  const handleSearchInputChange = (ev) => {
    resetSearchResults();
    setSearchInput(ev.target.value);
    if (ev.target.value) {
      setIsLoading(true);
      getSearchResults({
        searchQuery: ev.target.value,
        start: 0
      }).then((resp) => {
        setIsLoading(false);
      });
    }
  };

  const handlePageNumberChanged = (pageNum) => {
    resetSearchResults();
    setIsLoading(true);
    getSearchResults({
      searchQuery: searchInput,
      start: ((pageNum - 1) * 10) + 1
    }).then((resp) => {
      setIsLoading(false);
    });
  };

  return (
    <div className={styles.contentWrapper}>
      <Input
        className={styles.inputBox}
        type="text"
        id="search"
        placeholder="Enter search phrase"
        onChange={handleSearchInputChange}
        value={searchInput}
        autoFocus
      />
      { isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {isEmpty(searchResults) ? (
            <div>No search results</div>
          ) : (
            <>
            { searchResults.map(item => (
                <div className={styles.itemContainer} key={item.cacheId}>
                  <div className={styles.itemImageWrapper}>
                    <img src={get(item, 'pagemap.cse_thumbnail[0].src')} alt="" />
                  </div>
                  <div className={styles.itemContentWrapper}>
                    <a className={styles.linkText} href={item.formattedUrl}>{item.displayLink}</a>
                    <div className={styles.title} dangerouslySetInnerHTML={{ __html: item.title }} />
                    <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: item.snippet }} />
                  </div>
                </div>
              ))}
            </>
          )}
        </>
      )}
      { totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          {times(totalPages, Number).map(pageNo => (
            <div className={styles.paginationItem} key={pageNo} onClick={() => handlePageNumberChanged(pageNo + 1)}>{pageNo + 1}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
