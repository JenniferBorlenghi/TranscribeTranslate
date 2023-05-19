export default function PageContainer({ children, className }) {
  return (
    <main className="page">
      <div className={"container " + (className || "")}>{children}</div>
    </main>
  );
}
