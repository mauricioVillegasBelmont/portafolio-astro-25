export interface PushbarConfigObject {
  overlay: boolean;
  closer: string;
}

export type PushbarCustomEventDetails = {
  element: HTMLDialogElement | HTMLElement | null;
  id: string | null;
};
export interface PushbarCustomEvent extends CustomEvent {
  bubbles: boolean;
  detail: PushbarCustomEventDetails;
}
export default class Pushbar {
  static instance: Pushbar;
  activeId: string | null = null;
  activeElement: HTMLDialogElement | HTMLElement | null = null;
  constructor(config: object) {
    if (Pushbar.instance) return Pushbar.instance;
    Pushbar.instance = this;

    this.bindEvents();
  }
  emitOpening() {
    const event: PushbarCustomEvent = new CustomEvent("pushbar_opening", {
      bubbles: true,
      detail: {
        element: this.activeElement,
        id: this.activeId,
      },
    });

    this.activeElement?.dispatchEvent(event);
    this.openButtons.forEach((trigger) => {
      trigger.dispatchEvent(event);
    });
  }
  emitClosing() {
    const event: PushbarCustomEvent = new CustomEvent("pushbar_closing", {
      bubbles: true,
      detail: {
        element: this.activeElement,
        id: this.activeId,
      },
    });
    this.activeElement?.dispatchEvent(event);
    this.openButtons.forEach((trigger) => {
      trigger.dispatchEvent(event);
    });
  }
  handleOpenEvent(e:Event) {
    e.preventDefault();
    const t = (e.currentTarget as HTMLElement)?.getAttribute("data-pushbar-target");
    this.open(t);
  }
  handleCloseEvent(e?:Event) {
    if(e!== undefined) e.preventDefault()
    this.close();
  }
  handleKeyEvent(event: KeyboardEvent) {
    if (this.activeElement && event.code == "Escape") this.close();
  }

  private bindEvents() {
    this.openerBtnHelper();
    this.closerBtnHelper();
    this.dialogElementHelper();
    window.addEventListener('popstate', ()=> {this.handleCloseEvent();})


    document.addEventListener("keyup", (event) => this.handleKeyEvent(event));
  }
  open(pushbarId: string | null) {
    if (this.activeId === String(pushbarId) || !pushbarId) return;
    if (this.activeId && this.activeId !== String(pushbarId)) this.close();

    this.activeId = pushbarId;
    this.activeElement = document.querySelector(
      `[data-pushbar-id="${this.activeId}"]`
    );

    if (!this.activeElement) return;

    this.emitOpening();
    this.activeElement.classList.add("opened");
    this.htmlHelpers(true, pushbarId);
  }
  close() {
    if (!this.activeId) return;
    this.emitClosing();
    this.activeElement?.classList.remove("opened");
    this.htmlHelpers(false);
    this.activeId = null;
    this.activeElement = null;
  }
  get openButtons() {
    const openButtons = document.querySelectorAll("[data-pushbar-target]");
    return openButtons;
  }
  get closeButtons() {
    const closeButtons = document.querySelectorAll("[data-pushbar-close]");
    return closeButtons;
  }
  private htmlHelpers(toOpen: boolean, pushbarId: string = "") {
    if (toOpen) {
      const pageRootElement = document.querySelector("html");
      pageRootElement?.classList.add("pushbar_locked");
      pageRootElement?.setAttribute("pushbar", pushbarId);
      return;
    }
    const pageRootElement = document.querySelector("html");
    pageRootElement?.classList.remove("pushbar_locked");
    pageRootElement?.removeAttribute("pushbar");
  }
  private dialogElementHelper() {
    const dialogMenu = document.querySelectorAll("dialog[data-pushbar-id]");
    dialogMenu.forEach((dialogItem) => {
      dialogItem.addEventListener(
        "pushbar_closing" as any,
        (event:CustomEvent) => {
          event.detail.element.close();
        },
        false
      );
      dialogItem.addEventListener(
        "pushbar_opening" as any,
        (event:CustomEvent) => {
          event.detail.element.showModal();
        },
        false
      );

      dialogItem.addEventListener(
        "click" as any,
        (event: MouseEvent) => {
          if (!event.target) return;
          const target = event.target;
          if (!(target instanceof HTMLElement)) return;
          const rect = target.getBoundingClientRect();
          if (
            rect.left > event.clientX ||
            rect.right < event.clientX ||
            rect.top > event.clientY ||
            rect.bottom < event.clientY
          ) {
            this.handleCloseEvent(event);
          }
        },
        false
      );
    });
  }
  private closerBtnHelper() {
    // const closerButtons = document.querySelectorAll("[data-pushbar-close]");
    this.closeButtons.forEach((closerBtn) => {
      closerBtn.setAttribute("data-action", "close");
      closerBtn.addEventListener(
        "click",
        (e) => this.handleCloseEvent(e),
        false
      );
    });
  }
  private openerBtnHelper() {
    const self = this;
    // 'pushbar_opening'
    // 'pushbar_closing'
    this.openButtons.forEach((trigger) => {
      const action = !this.activeId ? "open" : "close";
      trigger.setAttribute("data-action", action);
      trigger.addEventListener(
        "pushbar_opening",
        () => {
          if (trigger instanceof HTMLElement) trigger.dataset.action = "close";
        },
        false
      );
      trigger.addEventListener(
        "pushbar_closing",
        () => {
          if (trigger instanceof HTMLElement) trigger.dataset.action = "open";
        },
        false
      );
      trigger.addEventListener(
        "click",
        (e) => {
          if (self.activeId) {
            return self.handleCloseEvent(e);
          }
          return self.handleOpenEvent(e);
        },
        false
      );
    });
  }
}
new Pushbar({})