interface Dataloaders {
  AccountLoader: ReturnType<
    typeof import('../account/account-loader').AccountLoader.getLoader
  >;
}

type Loaders =
  | { [Name in keyof Dataloaders]: () => Dataloaders[Name] }
  | Record<string, () => unknown>;

const loaders: Loaders = {};

const registerLoader = <Name extends keyof Dataloaders>(
  key: Name,
  getLoader: () => Dataloaders[Name]
) => {
  loaders[key] = getLoader;
};

const getDataloaders = (): Dataloaders =>
  (Object.keys(loaders) as (keyof Dataloaders)[]).reduce(
    (prev, loaderKey) => ({
      ...prev,
      [loaderKey]: loaders[loaderKey](),
    }),
    {}
  ) as Dataloaders;

export type { Dataloaders };
export { registerLoader, getDataloaders };
