import Login from "./_component/Login";
import Registration from "./_component/Registration";

export default function page() {
  return (
    <div className="space-y-20">
      <Registration />
      <Login />
    </div>
  );
}
