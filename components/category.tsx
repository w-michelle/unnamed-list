import { MoreHorizontal, Trash } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import axios from "axios";

interface CategoryProps {
  title: string;
  id: string;
  onDelete: (id: string) => void;
}

const Category: React.FC<CategoryProps> = ({ title, id, onDelete }) => {
  const [open, setOpen] = useState(false);

  const deleteCategory = async () => {
    onDelete(id);
  };

  return (
    <div className="flex items-center justify-between">
      <p>{title}</p>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            {<MoreHorizontal size={10} />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="text-red-600" onClick={deleteCategory}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
              <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Category;
