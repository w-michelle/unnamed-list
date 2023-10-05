import { UserButton } from "@clerk/nextjs";

const Navbar = () => {
  return (
    <div className="flex py-4 px-6">
      <div className="ml-auto">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar;
