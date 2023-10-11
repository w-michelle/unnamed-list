import NoteUpload from "@/components/noteUpload";
import { Plus } from "lucide-react";
interface Category {
  id: string;
  title: string;
  userId: String;
  city: String;
}
const Page = ({ searchParams }: any) => {
  return (
    <div className="md:pl-60">
      <div>
        <NoteUpload catData={searchParams} />
      </div>
    </div>
  );
};
export default Page;
