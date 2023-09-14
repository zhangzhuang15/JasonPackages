import { Result } from "./result";
import { RequestState } from "./state";

export interface Engine {
  (state: RequestState): Result;
}
