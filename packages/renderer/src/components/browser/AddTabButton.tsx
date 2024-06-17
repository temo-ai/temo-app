import {Plus} from 'lucide-react';
interface AddTabButtonProps {
  onClick: () => void;
}
const AddTabButton = ({onClick}: AddTabButtonProps) => {
  return (
    <div
      className="px-2 py-2 hover:bg-[#0d0e1312] transition text-gray-500 cursor-pointer rounded-lg flex items-center justify-center h-[30px] w-[30px]"
      onClick={onClick}
    >
      <Plus size={17} />
    </div>
  );
};
export default AddTabButton;
