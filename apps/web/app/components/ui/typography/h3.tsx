import type { TypographyHeaderProps } from './h1';

export function TypographyH3({ children }: TypographyHeaderProps) {
  return <h3 className="text-sm font-medium text-gray-500">{children}</h3>;
}
