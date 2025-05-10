export type TypographyHeaderProps = {
  children: string;
};

export function TypographyH1({ children }: TypographyHeaderProps) {
  return (
    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
}
