import React, { useState, useEffect, useMemo, RefObject, PropsWithChildren } from 'react';
import LazyloadService from './LazyloadService';

type Props = {
  pageSize?: number;
  records: any[];
  list: any;
  boxRef?: RefObject<any>;
  watchRef?: RefObject<any>;
}

export const LazyList = ({ pageSize, records, list: List, boxRef, watchRef, children}: PropsWithChildren<Props>) => {
  const size = pageSize || 20;
  const [page, setPage] = useState<number>(1);
  const [loadService, setLoadService] = useState<LazyloadService>();

  useEffect(() => {
    let service: LazyloadService;
    if (!boxRef || (boxRef && boxRef?.current)) {
      service = LazyloadService.createElementObserve(boxRef?.current || null);
      setLoadService(service);
    }
    return () => {
      if (service) {
        service.disconnect();
        setLoadService(undefined);
      }
    }
  }, []);

  const [pageCount, isLimit] = useMemo(() => {
    const count: any = Math.ceil(records.length / size) || 1;
    const limit: any = page >= count;
    return [count, limit];
  }, [records, size, page]);

  useEffect(() => {
    let unsubscribe: Function;
    if (!isLimit && loadService && watchRef?.current) {
      unsubscribe = loadService.subscribe(watchRef?.current, (e: any) => {
        if (e && e.intersectionRatio && page < pageCount) {
          setPage(page + 1);
        }
      })
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [loadService, page, pageCount, isLimit]);

  const currentRecords = useMemo(() => {
    return records ? records.slice(0, page * size) : records;
  }, [records, page, size]);

  return (<>
    <List records={ currentRecords }/>
    { !isLimit ? children : null }
  </>)
}