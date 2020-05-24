import { EmailsInputRenderer } from "./emails-input-renderer";
import { Email } from "./email";

describe("Emails Input Renderer", () => {
  let renderer: EmailsInputRenderer;
  let onChangesMock = jest.fn();
  let emails: Email[];

  beforeEach(() => {
    jest.clearAllMocks();
    emails = [new Email("abcdef"), new Email("abcdef@ghijk.lm"), new Email("fedcba@ghijk.lm")];
    document.body.innerHTML = '<div id="input-container"></div>';
    renderer = new EmailsInputRenderer(
      document.getElementById("input-container") as HTMLElement,
      onChangesMock
    );
  });

  describe("(snapshots)", () => {
    it("should create empty input", () => {
      expect(document.body).toMatchSnapshot();
    });

    it("should render email items", () => {
      renderer.render(emails);
      expect(document.body).toMatchSnapshot();
    });

    it("should rerender email items", () => {
      const emails1 = emails;
      const emails2 = [
        new Email("abcdef"),
        new Email("fedcba@ghijk.lm"),
        new Email("12345@gmail.com")
      ];

      renderer.render(emails1);
      renderer.render(emails2);

      expect(document.body).toMatchSnapshot();
    });
  });

  describe("(API)", () => {
    const initRemoveClick = (email: string) => {
      const button = document.querySelector(
        `[data-email="${email}"] .wrapper__item-remove`
      ) as HTMLElement;
      const event = new MouseEvent("click", { bubbles: true });
      button.dispatchEvent(event);
    };

    const initSubmitByKey = (text: string, submitKey: "Enter" | ",") => {
      const input = document.querySelector(`.wrapper__input`) as HTMLInputElement;
      input.value = text;
      const event = new KeyboardEvent("keyup", { bubbles: true, key: submitKey });
      input.dispatchEvent(event);
    };

    const initSubmitByEvent = (text: string, eventName: "blur" | "paste") => {
      const input = document.querySelector(`.wrapper__input`) as HTMLInputElement;
      input.value = text;

      const event = new Event(eventName, { bubbles: true });
      input.dispatchEvent(event);

      if (eventName === "paste") {
        jest.runAllTimers();
      }
    };

    beforeEach(() => {
      jest.useFakeTimers();
    });

    it("should notify on remove click", () => {
      renderer.render(emails);

      initRemoveClick("abcdef");

      expect(onChangesMock).toBeCalledWith({ addedItems: [], removedItems: ["abcdef"] });
    });

    it("should not notify submit on empty input", () => {
      renderer.render(emails);

      initSubmitByKey("", "Enter");

      expect(onChangesMock).not.toBeCalled();
    });

    it.each(["Enter", ","])("should notify submit on %s", submitKey => {
      renderer.render(emails);

      initSubmitByKey("123", submitKey as "Enter" | ",");

      expect(onChangesMock).toBeCalledWith({ addedItems: ["123"], removedItems: [] });
    });

    it("should notify submit on blur event", () => {
      renderer.render(emails);

      initSubmitByEvent("123", "blur");

      expect(onChangesMock).toBeCalledWith({ addedItems: ["123"], removedItems: [] });
    });

    it("should parse and filter complex input on paste", () => {
      renderer.render(emails);

      initSubmitByEvent("  123,, , 456   , abcdef@gmail.com,", "paste");

      expect(onChangesMock).toBeCalledWith({
        addedItems: ["123", "456", "abcdef@gmail.com"],
        removedItems: []
      });
    });
  });
});
