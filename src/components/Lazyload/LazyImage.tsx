import React, { useState, useEffect, PropsWithChildren, createRef } from 'react';
import LazyloadService from './LazyloadService';

type Props = {
  width?: number;
  height?: number;
  style?: any;
  checkUrl?: string;
  observe?: LazyloadService;
  className?: string;
}

export function LazyImage({ style, checkUrl, className, observe, children }: PropsWithChildren<Props>) {
  const child: any = children;
  const [loaded, setLoaded] = useState(
    checkUrl ? LazyloadService.checkLoadedUrl(checkUrl) : false
  );
  const [loadService, setLoadService] = useState<LazyloadService>();
  const placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURd3d3e7fjoIAAAAKSURBVAjXY2AAAAACAAHiIbwzAAAAAElFTkSuQmCC';
  const watchRef = createRef<any>();

  useEffect(() => {
    const service: LazyloadService = observe || LazyloadService.getInstance();
    setLoadService(service);
    return () => {
      if (service) {
        service.disconnect();
        setLoadService(undefined);
      }
    }
  }, []);

  useEffect(() => {
    let unsubscribe: Function | null;
    if (!loaded && watchRef.current && loadService) {
      unsubscribe = loadService.subscribe(watchRef.current, (e: any) => {
        if (e && e.intersectionRatio) {
          if (checkUrl) {
            LazyloadService.addLoadedUrl(checkUrl);
          }
          unsubscribe && unsubscribe();
          unsubscribe = null;
          setLoaded(true);
        }
      })
    }
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [loadService, loaded, watchRef]);

  return (loaded ? child : <img style={ style } ref={ watchRef } src={ placeholder } className={ className } />);
}
