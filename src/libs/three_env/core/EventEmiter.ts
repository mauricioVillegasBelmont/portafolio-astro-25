type ObserverListener = (...args: any) => unknown ;
class EventEmitter {
  static instance: EventEmitter;
  events: { [key: string]: Set<ObserverListener> };
  constructor() {
    this.events = {};
    if (EventEmitter.instance) return EventEmitter.instance;
    EventEmitter.instance = this;
  }

  on(event: string, listener: ObserverListener) {
    if (!this.events[event]) this.events[event] = new Set();
    this.events[event].add(listener);
  }

  emit(event: string, data: any | any[]) {
    if (this.events[event])
      this.events[event].forEach((listener) => listener(data));
  }
}
export default EventEmitter;