import {
  Collapse,
  Dropdown,
  Input,
  Navbar,
  Pagination,
} from '@nextui-org/react';
import { useDebounceEffect, useKeyPress } from 'ahooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiFilter, BiSearch } from 'react-icons/bi';
import { Box } from '../components/layout/Box';
import { itemsPerPage } from '../lib/global';
import { HIssue } from './HIssue';

export const HList = (data) => {
  const [listData, setListData] = useState();
  const searchRef = useRef(null);
  const [searchValue, setSearchValue] = useState();
  const [labels, setLabels] = useState();
  // eslint-disable-next-line no-undef
  const [selected, setSelected] = useState(new Set(['ALL']));
  const [pageTotal, setPageTotal] = useState(0);
  const selectedValue = useMemo(
    () => Array.from(selected).join(', ').replaceAll('_', ' '),
    [selected]
  );
  const { t } = useTranslation();
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [filterredData, setFilterredData] = useState();

  useKeyPress(
    'enter',
    () => {
      setSearchValue(searchRef.current.value);
    },
    {
      target: searchRef,
    },
    {
      exactMatch: true,
    }
  );

  const handleSelect = (e) => {
    // if selected only contain one element and it is 'ALL', and e contains more than 'ALL', then remove 'ALL'
    if (
      selected.size === 1 &&
      selected.has('ALL') &&
      e.size > 1 &&
      e.has('ALL')
    ) {
      // eslint-disable-next-line no-undef
      ret = new Set([]);
      e.forEach((k) => {
        if (k !== 'ALL') {
          ret.add(k);
        }
      });
      setSelected(ret);
      return;
    }
    // if selected does not contain 'ALL', but e contains 'ALL', then selected = 'ALL'
    if (!selected.has('ALL') && e.has('ALL')) {
      // eslint-disable-next-line no-undef
      var ret = new Set([]);
      ret.add('ALL');
      setSelected(ret);
      return;
    }
    setSelected(e);
  };

  useDebounceEffect(
    () => {
      if (!searchValue && selected.has('ALL')) {
        setFilterredData(data.data);
        setListData(data.data);
        return;
      }
      var regex = new RegExp(searchValue, 'i');
      const filterred = data.data.filter((issue) => {
        return (
          issue['title'].search(regex) > -1 || issue['body'].search(regex) > -1
        );
      });
      const filteredArray = filterred.filter((value) => {
        var ret = value['labels.name'].filter(
          (x) => selected.has(x.toUpperCase()) || selected.has('ALL')
        );
        var len = ret.length;
        return len > 0;
      });

      setFilterredData(filteredArray);
      setCurrentPageNumber(1);
      // setListData(filterredData.slice(0, itemsPerPage));
    },
    [searchValue, selected],
    { wait: 2000 }
  );

  useDebounceEffect(
    () => {
      if (filterredData && filterredData.length > 0) {
        setPageTotal(Math.ceil(filterredData.length / itemsPerPage));
        setListData(
          filterredData.slice(
            (currentPageNumber - 1) * itemsPerPage,
            currentPageNumber * itemsPerPage
          )
        );
      }
    },
    [currentPageNumber, filterredData],
    { wait: 1000 }
  );

  useEffect(() => {
    if (!listData) {
      setPageTotal(0);
    } else {
      var count = Object.keys(listData).length;
      if (count === 0) {
        setPageTotal(0);
      } else {
        setPageTotal(count / itemsPerPage + 1);
      }
    }
  }, [listData]);

  useEffect(() => {
    if (data.header) {
      var menuItems = [];
      data.header.forEach((item) => {
        menuItems.push({ key: item.toUpperCase(), value: item });
      });
      menuItems.push({ key: 'ALL', value: 'all' });
      setLabels(menuItems);
    }
    if (data.data) {
      setListData(data.data);
    }
  }, [data]);

  return (
    <Box>
      <Navbar isBordered variant="sticky">
        <Navbar.Brand css={{ mr: '$4' }}>
          <Dropdown placement="bottom-right">
            <Dropdown.Button light>
              <BiFilter size="2em" />
              {selectedValue}
            </Dropdown.Button>
            <Dropdown.Menu
              aria-label="Blog Labels"
              color="secondary"
              items={labels}
              disallowEmptySelection
              selectionMode="multiple"
              selectedKeys={selected}
              onSelectionChange={handleSelect}
            >
              {(item) => (
                <Dropdown.Item withDivider={item.key === 'ALL'} key={item.key}>
                  {item.value}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Brand>
        <Navbar.Content
          css={{
            '@xsMax': {
              w: '100%',
              jc: 'space-between',
            },
          }}
        >
          {pageTotal > 0 && (
            <Navbar.Item
              css={{
                '@xsMax': {
                  w: '100%',
                  jc: 'center',
                },
              }}
            >
              <Pagination
                aria-label="pagination"
                noMargin
                shadow
                onChange={(page) => setCurrentPageNumber(page)}
                total={pageTotal}
                initialPage={1}
              />
            </Navbar.Item>
          )}
          <Navbar.Item
            css={{
              '@xsMax': {
                w: '100%',
                jc: 'center',
              },
            }}
          >
            <Input
              clearable
              ref={searchRef}
              aria-label="search"
              contentLeft={<BiSearch size="1em" />}
              contentLeftStyling={false}
              onClearClick={() => setSearchValue('')}
              placeholder={t('global.search')}
            />
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>

      <Collapse.Group key="Issues">
        {listData &&
          listData.map((issue) => (
            <HIssue title={issue.title} key={issue.updated_at} issue={issue} />
          ))}
      </Collapse.Group>
    </Box>
  );
};
