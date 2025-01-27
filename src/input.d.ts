declare module 'input' {
    function text(question?: string): Promise<string>;
    function confirm(question?: string): Promise<boolean>;
  }
  