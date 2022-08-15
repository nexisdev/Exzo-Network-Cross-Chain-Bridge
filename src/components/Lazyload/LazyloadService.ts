type SubscribeCallback = (entry: IntersectionObserverEntry, unsubscribe: Function) => void;

type CallbackItem = {
  element: HTMLElement;
  callback: SubscribeCallback;
  unsubscribe: Function;
}

type ObserveData = {
  element: HTMLElement | null;
  observe?: IntersectionObserver;
  callbacks?: CallbackItem[];
}

enum ObserveStatus {
  Pending,
  Connect,
  Disconnect,
  NotSupport
}

export default class LazyloadService {
  static _instance: LazyloadService;

  static getInstance() {
    if (!this._instance) {
      this._instance = new LazyloadService();
    }
    return this._instance;
  }

  // 创建元素观察者
  static createElementObserve(el?: HTMLElement | null, options: IntersectionObserverInit = {}): LazyloadService {
    const service = new LazyloadService();
    service.isRoot = false;
    if (el || el === null) {
      service.connect(el, options);
    }
    return service;
  }

  static loadedUrl: string[] = [];
  static checkLoadedUrl(url: string) {
    return this.loadedUrl.indexOf(url) > -1;
  }
  static addLoadedUrl(url: string) {
    if (!this.checkLoadedUrl(url)) {
      this.loadedUrl.push(url);
    }
    return url;
  }

  observeData: ObserveData;
  waitCallbacks: CallbackItem[];
  status: ObserveStatus;
  isRoot: boolean;

  constructor() {
    this.observeData = {
      element: null,
      callbacks: []
    };
    this.isRoot = true;
    this.waitCallbacks = [];
    this.status = ObserveStatus.Pending;
  }

  // 创建观察对象
  createObserve(element?: HTMLElement | null, setOptions: IntersectionObserverInit = {}) {
    const observeItem = this.observeData as ObserveData;
    const options: any = { rootMargin: '50px', ...setOptions };
    if (element) {
      options.root = element;
    }
    let observe: any = null;
    if ('IntersectionObserver' in window) {
      const observeCallback = (entries: IntersectionObserverEntry[]) => {
        if (observeItem && observeItem.callbacks?.length) {
          for(const entry of entries) {
            if (!entry.isIntersecting) continue;
            for(const item of observeItem.callbacks) {
              if (item.element === entry.target) {
                item.callback(entry, item.unsubscribe);
                break;
              }
            }
          }
        }
      };
      observe = new IntersectionObserver(observeCallback, options);
    }
    observeItem.observe = observe;
    return observe;
  }

  // 连接到对象
  connect(el: HTMLElement | null, options: IntersectionObserverInit = {}) {
    const observe = this.createObserve(el, options);
    if (observe) {
      if (this.waitCallbacks.length) {
        this.waitCallbacks.forEach((item) => {
          observe?.observe(item.element);
        });
      }
      this.observeData.callbacks = this.waitCallbacks;
      this.waitCallbacks = [];
      this.status = ObserveStatus.Connect;
    }
    else {
      const call = () => {
        //
      };
      this.waitCallbacks.forEach((item) => {
        const entry: any = { isIntersecting: 1 };
        item.callback(entry, call);
      });
      this.waitCallbacks = [];
      this.status = ObserveStatus.NotSupport;
    }
  }

  // 断开连接
  disconnect() {
    if (this.status == ObserveStatus.Connect) {
      this.observeData.observe?.disconnect();
      this.observeData = {
        element: null,
        callbacks: []
      };
      this.waitCallbacks = [];
      this.status = ObserveStatus.Disconnect;
    }
  }

  // 订阅事件
  subscribe(el: HTMLElement, callback: SubscribeCallback): Function {
    let unsubscribe = () => {
      //
    };
    if (this.isRoot && this.status != ObserveStatus.Connect) {
      if (
        this.status === ObserveStatus.Pending ||
        this.status === ObserveStatus.Disconnect
      ) {
        if (this.createObserve()) {
          this.status = ObserveStatus.Connect;
        }
        else {
          this.status = ObserveStatus.NotSupport;
        }
      }
      // 处理不支持的情况
      if (this.status === ObserveStatus.NotSupport) {
        const entry: any = { isIntersecting: 1 };
        callback(entry, unsubscribe);
      }
    }
    unsubscribe = () => this.unsubscribe(el);
    const observeItem = this.observeData;
    if (this.status == ObserveStatus.Connect) {
      observeItem.observe?.observe(el);
      observeItem.callbacks?.push({
        element: el, callback, unsubscribe
      });
    }
    else if (this.status == ObserveStatus.Pending) {
      this.waitCallbacks.push({
        element: el, callback, unsubscribe
      });
    }
    else {
      console.warn('this observe is disconnect');
    }
    return unsubscribe;
  }

  // 取消订阅事件
  unsubscribe(el: HTMLElement) {
    let callbacks = this.observeData.callbacks || [];
    if (this.status == ObserveStatus.Pending) {
      callbacks = this.waitCallbacks;
    }
    for(let i=callbacks.length - 1; i>-1; i--) {
      const item = callbacks[i];
      if (item.element === el) {
        if (this.observeData.observe) {
          this.observeData.observe.unobserve(el);
        }
        callbacks.splice(i, 1);
        break;
      }
    }
    // 仅在全局模式下自动断开连接
    if (this.isRoot && !callbacks.length) {
      this.disconnect();
    }
  }
}
