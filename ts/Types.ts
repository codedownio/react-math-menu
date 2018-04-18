
export interface IMathMenuItem {
  name?: string;
  icon?: any;
  tex?: string;
  rawTex?: string;
  key?: string;
  children?: IMathMenuItem[];

  type?: "text" | "icon";

  special?: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  chord?: string;
  disabled?: string;

  isSeparator?: boolean;
}
