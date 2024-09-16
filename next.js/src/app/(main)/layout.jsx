export default function layout({ children }) {
  return (
    <div className="max-w-[700px] mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold text-center mb-10">
        Express + Next + Socket.io
      </h2>

      <div>{children}</div>
    </div>
  );
}
