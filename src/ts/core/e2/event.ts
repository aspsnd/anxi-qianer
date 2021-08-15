export class AnxiEvent<EventName = string>{
  intercepted = false
  data
  constructor(public name: EventName, ...data: any[]) {
    this.data = data;
  }
  intercept() {
    this.intercepted = true;
  }
}