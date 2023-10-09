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
  ModalHeader,
  ModalBody,
  Tooltip,
  ModalFooter,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Issue } from './Issue';
import { Chat } from './Chat';
import { useSettings } from '@/lib/useSettings';
import { BiSearch } from 'react-icons/bi';

export const IssueList = ({ ComponentName, data }) => {
  const { t } = useTranslation();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [audioSrc, setAudioSrc] = useState('');
  var pages = Math.ceil(data?.length / rowsPerPage);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { languageCode, speakerName } = useSettings();
  const [filterValue, setFilterValue] = useState('');

  useEffect(() => {
    if (data) {
      Math.ceil(data.length / rowsPerPage);
    }
  }, [data, rowsPerPage]);

  const readText = useCallback((text) => {
    onOpen();
    handleText2Speech(text);
    // popup the audio play and put the text in it to read it out loud
  });

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

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);
  const filterItems = useMemo(() => {
    let filteredData = data;
    if (filterValue) {
      var regex = new RegExp(filterValue, 'i');
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
          <div className="flex text-lg justify-center lg:gap-8 items-center m-4">
            <Input
              isClearable
              className="w-auto sm:max-w-[33%] mr-4"
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
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </label>
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
