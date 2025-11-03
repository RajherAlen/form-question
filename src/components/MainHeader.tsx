export default function MainHeader({
  headerTitle,
  children,
}: {
  headerTitle: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 h-[70px]">
      <h1 className="text-2xl font-semibold text-gray-800">{headerTitle}</h1>
      {children && <div>{children}</div>}
    </header>
  );
}
