import { AppSidebar } from "@/components/app-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-background">
      <AppSidebar />
      {children}
    </div>
  );
}
