import AdminHeader from "@/components/layout/AdminHeader";

export default function layout({ children }) {
  return (
    <div>
      <AdminHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {children}
      </main>
    </div>
  );
}
