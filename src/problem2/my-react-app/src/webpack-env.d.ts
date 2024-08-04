interface RequireContext {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (path: string): any;
    keys(): string[];
  }
  
  declare const require: {
    context: (path: string, deep?: boolean, filter?: RegExp) => RequireContext;
  };