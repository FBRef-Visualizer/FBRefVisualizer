export type TimeFormat = 12 | 24;

export interface Options {
  timeFormat: TimeFormat;
}

export const defaultOptions: Options = {
  timeFormat: 12
};
