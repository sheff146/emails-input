import { EmailsInput } from "./emails-input";
import { IChanges, IEmail } from "./interfaces";

describe("EmailsInput API", () => {
  let input: EmailsInput;

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '<div id="input-wrapper"></div>';
    input = new EmailsInput(document.getElementById("input-wrapper") as HTMLElement);
  });

  it("should create an empty input", () => {
    expect(input.getAllEmails()).toEqual([]);
  });

  it("should replace e-mails and remove duplicates and empty values", () => {
    input.replaceEmails(["a", "abc@xyz.com", "b", "a", null!, "", undefined!]);

    expect(input.getAllEmails()).toEqual([
      { isValid: false, value: "a" },
      { isValid: true, value: "abc@xyz.com" },
      { isValid: false, value: "b" }
    ]);
  });

  it("should rerender on replacing e-mails", () => {
    const renderSpy = jest.spyOn(input["_renderer"], "render");

    input.replaceEmails(["a", "abc@xyz.com", "b", "a"]);

    expect(renderSpy).toBeCalledTimes(1);
  });

  it("should rerender on UI updates", () => {
    const renderSpy = jest.spyOn(input["_renderer"], "render");
    input.replaceEmails(["a", "abc@xyz.com", "b", "a"]);
    renderSpy.mockClear();

    input["_renderer"]["onChanges"]({
      addedItems: ["abc@xyz.com", "123@sdf.gf", "aaaaa"],
      removedItems: []
    });

    expect(renderSpy).toBeCalledTimes(1);
  });

  it("should notify subscribers on UI updates", () => {
    const callback = jest.fn();
    input.subscribe(callback);

    input["_renderer"]["onChanges"]({
      addedItems: ["abc@xyz.com", "123@sdf.gf", "aaaaa"],
      removedItems: []
    });

    expect(callback).toBeCalledTimes(1);
  });

  it("should notify several subscribers", () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();

    input.subscribe(callback1);
    input.subscribe(callback2);
    input.subscribe(callback3);

    input.replaceEmails([]);

    expect(callback1).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
    expect(callback3).toBeCalledTimes(1);
  });

  it("shouldn't notify after unsubscription", () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();
    const callback3 = jest.fn();

    input.subscribe(callback1);
    const subscription2 = input.subscribe(callback2);
    input.subscribe(callback3);

    input.replaceEmails([]);
    subscription2.unsubscribe();
    input.replaceEmails([]);

    expect(callback1).toBeCalledTimes(2);
    expect(callback2).toBeCalledTimes(1);
    expect(callback3).toBeCalledTimes(2);
  });

  it("should handle subscriber error", () => {
    const error = new Error("test");
    const consoleSpy = jest.spyOn(console, "error").mockImplementationOnce(() => {});

    input.subscribe(() => {
      throw error;
    });
    expect(() => input.replaceEmails([])).not.toThrow();
    expect(consoleSpy).toBeCalledWith(error);
  });

  it("should report correct changes", () => {
    expect.assertions(1);

    input.replaceEmails(["ccccc", "abc@xyz.com"]);

    const callback = (changes: IChanges<IEmail>) => {
      expect(changes).toEqual({
        addedItems: [
          { isValid: false, value: "a" },
          { isValid: true, value: "abc@xyz.com" },
          { isValid: false, value: "b" }
        ],
        removedItems: [
          { isValid: false, value: "ccccc" },
          { isValid: true, value: "abc@xyz.com" }
        ]
      });
    };

    input.subscribe(callback);
    input.replaceEmails(["a", "abc@xyz.com", "b", "a"]);
  });
});
