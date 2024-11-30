import { MainHeader } from "./MainHeader";
import { MainSidebar } from "./MainSidebar";

const MainNavigation: React.FC = () => {
  return (
    <>
      <MainHeader>
        <h1 className="text-primary text-3xl">Украінська Залізниця</h1>
        <nav className="hidden h-full md:block">
          <MainSidebar />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
