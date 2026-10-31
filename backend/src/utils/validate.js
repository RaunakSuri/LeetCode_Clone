import validator from "validator";

const validate = async (data) => {
  const mandatoryField = ["firstName", "emailId", "password"];

  const isAllowed = mandatoryField.every((k) => Object.keys(data).includes(k));

  if (!isAllowed) {
    throw new Error("Please Enter All The Fields");
  }
  if (!validator.isEmail(data.emailId)) {
    throw new Error("Enter A Valid Email");
  }
  if (!validator.isStrongPassword(data.password)) {
    throw new Error("Password Is Weak | Please Enter a Strong Password");
  }
};

export { validate };
