import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children, title, user, onLogout }) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar title={title} user={user} onLogout={onLogout} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
