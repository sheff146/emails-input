import { Email } from "./email";

describe("Email", () => {
  it("should create a valid e-mail", () => {
    const email = new Email("abc@xyz.com");

    expect(email.value).toBe("abc@xyz.com");
    expect(email.isValid).toBe(true);
  });

  it("should create an invalid e-mail", () => {
    const email = new Email("abc");

    expect(email.value).toBe("abc");
    expect(email.isValid).toBe(false);
  });
});
