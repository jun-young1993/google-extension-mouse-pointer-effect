interface TabsProps {
  items: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Tabs = ({ items, activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="flex space-x-1 mb-2">
      {items.map((item) => (
        <button
          key={item}
          className={`px-3 py-1 text-sm rounded-md transition-all ${
            activeTab === item
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
          onClick={() => onTabChange(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
