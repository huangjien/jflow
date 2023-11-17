import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
  Input,
  Divider,
} from '@nextui-org/react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Issue } from './Issue';
import { Chat } from './Chat';
import { useSettings } from '@/lib/useSettings';
import { BiSearch } from 'react-icons/bi';
import { useLocalStorageState } from 'ahooks';
import { useAuth } from '../lib/useAuth';
import { IssueModal } from './IssueModal';

/**
 * Renders a table component that displays a list of issues or chats.
 * Provides functionality for searching, filtering, pagination, and text-to-speech.
 *
 * @param {Array} tags - An array of tags to filter the data by.
 * @param {string} ComponentName - The name of the component to render for each item in the table.
 * @param {Array} data - An array of issue or chat data.
 * @param {string} inTab - The tab name indicating the type of data being displayed. (default: 'ai')
 * @returns {JSX.Element} - The rendered table component with the filtered and paginated data.
 */
export const IssueList = ({ tags, ComponentName, data, inTab = 'ai' }) => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useLocalStorageState('RowsPerPage', {
    defaultValue: 5,
  });
  const [page, setPage] = useState(1);
  const [audioSrc, setAudioSrc] = useState('');
  const [pages, setPages] = useState(Math.ceil(data?.length / rowsPerPage));
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { languageCode, speakerName } = useSettings();
  const [filterValue, setFilterValue] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (data) {
      setPages(Math.ceil(data.length / rowsPerPage));
    }
  }, [data, rowsPerPage]);

  const readText = useCallback(
    (text) => {
      onOpen();
      handleText2Speech(text);
      // popup the audio play and put the text in it to read it out loud
    },
    [onOpen]
  );

  const renderCell = useCallback(
    (itemData, columnKey) => {
      switch (columnKey) {
        case 'Issue':
          return <Issue issue={itemData} />;
        case 'Chat':
          return <Chat player={readText} name={itemData.id} data={itemData} />;
        default:
          return <pre>{JSON.stringify(itemData)}</pre>;
      }
    },
    [readText]
  );

  const onRowsPerPageChange = useCallback(
    (e) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [setPage, setRowsPerPage]
  );
  const filterItems = useMemo(() => {
    let filteredData = data;
    if (filterValue) {
      let regex = new RegExp(filterValue, 'i');
      filteredData = filteredData.filter((oneItem) => {
        return JSON.stringify(oneItem).search(regex) > -1;
      });
    }

    return filteredData;
  }, [filterValue, data]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    if (!filterItems) return [];
    return filterItems.slice(start, end);
  }, [page, filterItems, rowsPerPage]);

  const handleText2Speech = async (text) => {
    const res = await fetch(
      `/api/tts?&&languageCode=${languageCode}&&name=${speakerName}&&text=${encodeURIComponent(
        text.replaceAll('\n', '')
      )}`
    );
    const blob = await res.blob();
    const audioUrl = URL.createObjectURL(blob);
    setAudioSrc(audioUrl);
  };

  const stopReading = () => {
    setAudioSrc('');
  };

  return (
    <div>
      <Modal
        isDismissable={false}
        backdrop={'transparent'}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={stopReading}
      >
        <ModalContent>
          <ModalBody>
            <audio disabled={!audioSrc} controls autoPlay src={audioSrc} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Table
        classNames={'text-large'}
        isStriped
        hideHeader
        aria-label="list"
        topContent={
          <div className="lg:inline-flex flex-wrap  text-lg justify-center lg:gap-8 items-center m-4">
            {user && (inTab === 'issue' || inTab === 'settings') && (
              <IssueModal action={'new'} />
            )}
            <Input
              isClearable
              className="w-auto sm:max-w-[33%] m-4"
              placeholder={t('global.search')}
              startContent={<BiSearch />}
              value={filterValue}
              onClear={() => setFilterValue('')}
              onValueChange={setFilterValue}
            />
            <span className="text-default-400 text-small">
              {t('issue.total', { total: data?.length })}
            </span>
            <Pagination
              isCompact
              showControls
              showShadow
              color="success"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />

            <label className="flex  items-center text-default-400 text-small">
              {t('issue.row_per_page')}
              <select
                className="bg-transparent outline-none text-default-400 text-small"
                onChange={onRowsPerPageChange}
                value={rowsPerPage}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
            <Divider />
          </div>
        }
        className=" min-h-max w-auto text-large lg:m-4 "
      >
        <TableHeader>
          <TableColumn key="id">id</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell className=" lg:m-4">
                {renderCell(item, ComponentName)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
