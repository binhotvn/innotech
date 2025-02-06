export interface PackageJsonType {
  name: string;
  version: string;
  appVersion?: string;
  description?: string;
  main?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}
