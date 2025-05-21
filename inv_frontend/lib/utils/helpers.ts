import * as Yup from "yup";

import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/selectors/auth.selector";


export interface IAuthMe {
  id: string;
  email: string;
  username: string;
  system_user_type: string;
  _id: any;  
  user?: any;
}


export const allowedRequests = [
  "Incorrect password",
  "Incorrect username or password",
  "User is not an organization admin",
];

export const requiredField = Yup.string().required("Field is required");

export const phoneNumberAutoFormat = (phoneNumber: string): string => {
  const number = phoneNumber.trim().replace(/[^\d]/g, "").slice(0, 10) || "";

  if (number.length < 4) return number;
  if (number.length < 7) return number.replace(/(\d{3})(\d{1})/, "$1-$2");
  if (number.length < 11)
    return number.replace(/(\d{3})(\d{3})(\d{1})/, "$1-$2-$3");
  return number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
};

export const cardNumberFormat = (value: string) =>
  value
    .replace(/\W/gi, "")
    .replace(/(.{4})/g, "$1 ")
    .slice(0, 19)
    .replace(/[^\d^ ]/g, "")
    .trim();

export const onlyNumberFormat = (value: string) =>
  value.trim().replace(/[^\d]/g, "");
export const minusPlusNumberFormat = (value: string) =>
  value.trim().replace(/[^-^\d^.]/g, "");
export const currencyFormat = (value: string) => {
  const currency = Number(
    value.replace(/^(?!0\.00)\d{1,3}(,\d{3})*(\.\d\d)?$/g, "")
  );
  if (!currency) return value;
  return currency.toLocaleString("en", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const isNumber = (value: string) =>
  !!Number(+value?.replace(/[^\d^.]/g, ""));

export const currencyExportFormat = (value: string) =>
  +Number(+value.replace(/[^\d^.]/g, "")).toLocaleString("en", {
    useGrouping: false,
  });
export const ssnNumberFormat = (value: string) =>
  onlyNumberFormat(value)
    .replace(/^(\d{3})/, "$1-")
    .replace(/-(\d{2})/, "-$1-")
    .replace(/(\d)-(\d{4}).*/, "$1-$2");
export const einNumberFormat = (value: string) =>
  onlyNumberFormat(value).replace(/^(\d{2})/, "$1-");

export const isAdmin = (auth: IAuthMe) => auth?.system_user_type === "admin";

export const preventNumbers = (evt: any) =>
  ["e", "E", "+", "-", ","].includes(evt.key) && evt.preventDefault();

export type FlexDirection =
  | "column"
  | "inherit"
  | "-moz-initial"
  | "initial"
  | "revert"
  | "unset"
  | "column-reverse"
  | "row"
  | "row-reverse"
  | undefined;

export type PhoneOptionType = { label: string; value: string };
export const phoneOptions = [
  { label: "+1", value: "+1" },
  { label: "+7", value: "+7" },
  { label: "+20", value: "+20" },
  { label: "+27", value: "+27" },
  { label: "+30", value: "+30" },
  { label: "+31", value: "+31" },
  { label: "+32", value: "+32" },
  { label: "+33", value: "+33" },
  { label: "+34", value: "+34" },
  { label: "+36", value: "+36" },
  { label: "+39", value: "+39" },
  { label: "+40", value: "+40" },
  { label: "+41", value: "+41" },
  { label: "+43", value: "+43" },
  { label: "+44", value: "+44" },
  { label: "+45", value: "+45" },
  { label: "+46", value: "+46" },
  { label: "+47", value: "+47" },
  { label: "+48", value: "+48" },
  { label: "+49", value: "+49" },
  { label: "+51", value: "+51" },
  { label: "+52", value: "+52" },
  { label: "+53", value: "+53" },
  { label: "+54", value: "+54" },
  { label: "+55", value: "+55" },
  { label: "+56", value: "+56" },
  { label: "+57", value: "+57" },
  { label: "+58", value: "+58" },
  { label: "+60", value: "+60" },
  { label: "+61", value: "+61" },
  { label: "+62", value: "+62" },
  { label: "+63", value: "+63" },
  { label: "+64", value: "+64" },
  { label: "+65", value: "+65" },
  { label: "+66", value: "+66" },
  { label: "+81", value: "+81" },
  { label: "+82", value: "+82" },
  { label: "+84", value: "+84" },
  { label: "+86", value: "+86" },
  { label: "+90", value: "+90" },
  { label: "+91", value: "+91" },
  { label: "+92", value: "+92" },
  { label: "+93", value: "+93" },
  { label: "+94", value: "+94" },
  { label: "+95", value: "+95" },
  { label: "+98", value: "+98" },
  { label: "+211", value: "+211" },
  { label: "+212", value: "+212" },
  { label: "+213", value: "+213" },
  { label: "+216", value: "+216" },
  { label: "+218", value: "+218" },
  { label: "+220", value: "+220" },
  { label: "+221", value: "+221" },
  { label: "+222", value: "+222" },
  { label: "+223", value: "+223" },
  { label: "+224", value: "+224" },
  { label: "+225", value: "+225" },
  { label: "+226", value: "+226" },
  { label: "+227", value: "+227" },
  { label: "+228", value: "+228" },
  { label: "+229", value: "+229" },
  { label: "+230", value: "+230" },
  { label: "+231", value: "+231" },
  { label: "+232", value: "+232" },
  { label: "+233", value: "+233" },
  { label: "+234", value: "+234" },
  { label: "+235", value: "+235" },
  { label: "+236", value: "+236" },
  { label: "+237", value: "+237" },
  { label: "+238", value: "+238" },
  { label: "+239", value: "+239" },
  { label: "+240", value: "+240" },
  { label: "+241", value: "+241" },
  { label: "+242", value: "+242" },
  { label: "+243", value: "+243" },
  { label: "+244", value: "+244" },
  { label: "+245", value: "+245" },
  { label: "+246", value: "+246" },
  { label: "+247", value: "+247" },
  { label: "+248", value: "+248" },
  { label: "+249", value: "+249" },
  { label: "+250", value: "+250" },
  { label: "+251", value: "+251" },
  { label: "+252", value: "+252" },
  { label: "+253", value: "+253" },
  { label: "+254", value: "+254" },
  { label: "+255", value: "+255" },
  { label: "+256", value: "+256" },
  { label: "+257", value: "+257" },
  { label: "+258", value: "+258" },
  { label: "+260", value: "+260" },
  { label: "+261", value: "+261" },
  { label: "+262", value: "+262" },
  { label: "+263", value: "+263" },
  { label: "+264", value: "+264" },
  { label: "+265", value: "+265" },
  { label: "+266", value: "+266" },
  { label: "+267", value: "+267" },
  { label: "+268", value: "+268" },
  { label: "+269", value: "+269" },
  { label: "+290", value: "+290" },
  { label: "+291", value: "+291" },
  { label: "+297", value: "+297" },
  { label: "+298", value: "+298" },
  { label: "+299", value: "+299" },
  { label: "+350", value: "+350" },
  { label: "+351", value: "+351" },
  { label: "+352", value: "+352" },
  { label: "+353", value: "+353" },
  { label: "+354", value: "+354" },
  { label: "+355", value: "+355" },
  { label: "+356", value: "+356" },
  { label: "+357", value: "+357" },
  { label: "+358", value: "+358" },
  { label: "+359", value: "+359" },
  { label: "+370", value: "+370" },
  { label: "+371", value: "+371" },
  { label: "+372", value: "+372" },
  { label: "+373", value: "+373" },
  { label: "+374", value: "+374" },
  { label: "+375", value: "+375" },
  { label: "+376", value: "+376" },
  { label: "+377", value: "+377" },
  { label: "+378", value: "+378" },
  { label: "+380", value: "+380" },
  { label: "+381", value: "+381" },
  { label: "+382", value: "+382" },
  { label: "+383", value: "+383" },
  { label: "+385", value: "+385" },
  { label: "+386", value: "+386" },
  { label: "+387", value: "+387" },
  { label: "+389", value: "+389" },
  { label: "+420", value: "+420" },
  { label: "+421", value: "+421" },
  { label: "+423", value: "+423" },
  { label: "+500", value: "+500" },
  { label: "+501", value: "+501" },
  { label: "+502", value: "+502" },
  { label: "+503", value: "+503" },
  { label: "+504", value: "+504" },
  { label: "+505", value: "+505" },
  { label: "+506", value: "+506" },
  { label: "+507", value: "+507" },
  { label: "+508", value: "+508" },
  { label: "+509", value: "+509" },
  { label: "+590", value: "+590" },
  { label: "+591", value: "+591" },
  { label: "+592", value: "+592" },
  { label: "+593", value: "+593" },
  { label: "+594", value: "+594" },
  { label: "+595", value: "+595" },
  { label: "+596", value: "+596" },
  { label: "+597", value: "+597" },
  { label: "+598", value: "+598" },
  { label: "+599", value: "+599" },
  { label: "+670", value: "+670" },
  { label: "+672", value: "+672" },
  { label: "+673", value: "+673" },
  { label: "+674", value: "+674" },
  { label: "+675", value: "+675" },
  { label: "+676", value: "+676" },
  { label: "+677", value: "+677" },
  { label: "+678", value: "+678" },
  { label: "+679", value: "+679" },
  { label: "+680", value: "+680" },
  { label: "+681", value: "+681" },
  { label: "+682", value: "+682" },
  { label: "+683", value: "+683" },
  { label: "+685", value: "+685" },
  { label: "+686", value: "+686" },
  { label: "+687", value: "+687" },
  { label: "+688", value: "+688" },
  { label: "+689", value: "+689" },
  { label: "+690", value: "+690" },
  { label: "+691", value: "+691" },
  { label: "+692", value: "+692" },
  { label: "+800", value: "+800" },
  { label: "+808", value: "+808" },
  { label: "+850", value: "+850" },
  { label: "+852", value: "+852" },
  { label: "+853", value: "+853" },
  { label: "+855", value: "+855" },
  { label: "+856", value: "+856" },
  { label: "+870", value: "+870" },
  { label: "+878", value: "+878" },
  { label: "+880", value: "+880" },
  { label: "+881", value: "+881" },
  { label: "+882", value: "+882" },
  { label: "+883", value: "+883" },
  { label: "+886", value: "+886" },
  { label: "+888", value: "+888" },
  { label: "+960", value: "+960" },
  { label: "+961", value: "+961" },
  { label: "+962", value: "+962" },
  { label: "+963", value: "+963" },
  { label: "+964", value: "+964" },
  { label: "+965", value: "+965" },
  { label: "+966", value: "+966" },
  { label: "+967", value: "+967" },
  { label: "+968", value: "+968" },
  { label: "+970", value: "+970" },
  { label: "+971", value: "+971" },
  { label: "+972", value: "+972" },
  { label: "+973", value: "+973" },
  { label: "+974", value: "+974" },
  { label: "+975", value: "+975" },
  { label: "+976", value: "+976" },
  { label: "+977", value: "+977" },
  { label: "+979", value: "+979" },
  { label: "+992", value: "+992" },
  { label: "+993", value: "+993" },
  { label: "+994", value: "+994" },
  { label: "+995", value: "+995" },
  { label: "+996", value: "+996" },
  { label: "+998", value: "+998" },
];

export const uniqList = (value: any) =>
  value
    .reduce((map: any, item: any) => map.set(item.id, item), new Map())
    .values();

export const getNumber = (options: PhoneOptionType[], value: string | null) => {
  if (!value) return null;
  const map = options.map((item) => {
    if (value?.indexOf(item.value) === 0) {
      return {
        phone: value.split(item.value)[1],
        code: item.value,
      };
    }
    return null;
  });
  return map.filter((item) => item)[0];
};

export const dateIsValid = (date: string) => {
  return !Number.isNaN(new Date(date).getTime());
};

export const commasListItem = (item?: string) => {
  return item ? item + "," : "";
};

export const getValidUrl = (url?: string | null) => {
  const newUrl = (url || "").trim().replace(/\s/g, "");

  if (/^(:\/\/)/.test(newUrl)) {
    return `http${newUrl}`;
  }
  if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
    return `http://${newUrl}`;
  }

  return newUrl;
};

export const isEmpty = (obj: any) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

export const passwordTests = () => {
  return Yup.string()
    .required("Password field is required")
    .min(8, "Password must be at least 8 characters long")
    .test("hasLower", "Password must have at least 1 lowercase", (value) =>
      /[a-z]/.test(value || "")
    )
    .test("hasUpper", "Password must have at least 1 uppercase", (value) =>
      /[A-Z]/.test(value || "")
    )
    .test("hasNumber", "Password must have at least 1 number", (value) =>
      /[0-9]/.test(value || "")
    )
    .test(
      "hasSymbol",
      "Password must have at least 1 special character",
      (value) => /[!"'”#$%&’()*+,-./:;<=>?@[\]^_`{|}~]/.test(value || "")
    );
};

export function Object_assign(target: any, ...sources: object[]) {
  sources.forEach((source: any) => {
    Object.keys(source).forEach((key) => {
      const s_val = source[key];
      const t_val = target[key];
      target[key] =
        t_val && s_val && typeof t_val === "object" && typeof s_val === "object"
          ? Object_assign(t_val, s_val)
          : s_val ?? t_val;
    });
  });
  return target;
}

export const parseTotalMinutesToHoursAndMinutes = (totalMinutes: number) => ({
  hours: Math.round(totalMinutes / 60),
  minutes: Math.round(totalMinutes % 60),
});

export const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);
export const capitalizeEachWord = (str: string) =>
  str.toLowerCase().split(" ").map(capitalizeFirstLetter).join(" ");
export const convertSnakeToText = (snake: string) => snake?.replace(/_/g, " ");
export const convertTextToUppercase = (snake: string) => snake?.replace(/ /g, "_").toUpperCase();
export const IsLoggedRole = (value: any) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const userInfo = useSelector((state: any) => state.authentication.user);
  const isUserRole = isLoggedIn && userInfo[0].role === value;
  return isUserRole;
};

// Change string in camel case  format
export const toCamelCaseFormat = (value: any) => {
  return value
    .toLowerCase()
    .split("_")
    .map((word: any, index: any) =>
      index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};
