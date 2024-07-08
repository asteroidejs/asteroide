export type StepContext = {
  locals: Map<string, unknown>;
  get<T>(key: string): T;
  set<T>(key: string, value: T): void;
};
