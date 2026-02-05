import TopNav from "./TopNav";
import MobileNav from "./MobileNav";
import InviteAcceptance from "./InviteAcceptance";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-24 lg:pb-0">
      <TopNav />
      <InviteAcceptance />
      <main className="mx-auto w-full max-w-7xl px-4 py-10">
        <div className="section-reveal">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
