export interface ResolvedResponseData {
  isBuffer?: Promise<any>;
  isJson?: Promise<any>;
  isBlob?: Promise<any>;
  isText?: Promise<any>;
  isError?: Promise<any>;
}

export interface ResolvedResponse<T = any> {
  status: number;
  statusDesc?: string;
  headers: Map<string, string>;
  data: T;
}
