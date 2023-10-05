import { CityNav } from "@/components/city-nav";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { useCategoryModal } from "@/hooks/use-category-modal";

const CityLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[110vh] bg-grayGreen">
      <CityNav />
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default CityLayout;
