export interface Result<T = unknown> {
  result: Promise<T>;
  cancelSwitch: (v: any) => void;
}
