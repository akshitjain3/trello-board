import { useDragLayer } from "react-dnd";

export const DragPreview = () => {
  const { item, itemType, currentOffset, isDragging } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      currentOffset: monitor.getSourceClientOffset(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      initialClientOffset: monitor.getClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  if (!isDragging || itemType !== "Task" || !currentOffset) {
    return null;
  }
  return (
    <div
      className="fixed pointer-events-none z-[1000] will-change-transform"
      style={{
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        transition: "transform 0.1s ease",
      }}
    >
      <div
        className="bg-white border-2 border-blue-500 rounded-lg shadow-xl w-72 py-2 px-4
                     transform scale-105 origin-center"
      >
        <div className="gap-2">
          <p className="font-semibold text-xl text-left text-blue-500">
            {item.title}
          </p>
          <p className="font-medium text-sm text-left">{item.desc}</p>
        </div>
      </div>
    </div>
  );
};
