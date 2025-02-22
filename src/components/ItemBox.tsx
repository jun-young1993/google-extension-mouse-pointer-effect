const ItemBox = ({
  children,
  isSelected,
  onClick,
}: {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className={`flex items-center justify-center p-4 border ${isSelected ? 'border-blue-500' : 'border-gray-300'} rounded-lg cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ItemBox;
