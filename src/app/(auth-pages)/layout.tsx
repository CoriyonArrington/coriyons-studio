// ATTEMPT 1: Removing the unnecessary 'async' keyword from the Layout component
// to resolve the '@typescript-eslint/require-await' error.

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div>
  );
}