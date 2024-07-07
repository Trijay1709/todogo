import { Navbar } from "@/components/Navbar/Navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className=" h-full">
        <div className="md: flex h-full w-[200px] z-30 flex-col fixed inset-y-0">
          <Navbar />
        </div>
        <div className="ml-[200px]">{children}</div>
      </div>
    </>
  );
}
