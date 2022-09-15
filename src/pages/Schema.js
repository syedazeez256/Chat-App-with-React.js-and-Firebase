import * as yup from "yup";

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
export const basicSchema = yup.object().shape({
  name: yup.string().required("Please enter name"),
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Please enter valid email"),
  password: yup
    .string()
    .min(8)
    .matches(passwordRules, {
      message: "Password must includes Capital & Small words",
    })
    .required("Please enter password"),
});
export const LoginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter valid email")
    .required("Please enter valid email"),
  password: yup.string().required("Please enter password"),
});
export const EmailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter email")
    .required("Please enter valid email"),
});
export const passwordSchema = yup.object().shape({
  password: yup.string().min(8).required("Please enter password"),
  confirmPassword: yup
    .string()
    .min(8)
    .oneOf([yup.ref("password"), null], "Password must match")
    .required("Confirm the password"),
});
