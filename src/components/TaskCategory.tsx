import { useRef, useState, type ReactNode } from "react";
import Modal from "./CustomTrelloModal";
import { useDrop } from "react-dnd";

type TaskCategoryProps = {
  columnName: string;
  children: ReactNode;
  count: number;
  columns: string[];
  addTask: (id: number, title: string, desc: string, category: string) => void;
  editTask: (
    id: number,
    title: string,
    desc: string,
    originalCategory: string,
    category: string
  ) => void;
  changePhase: (
    fromColumn: string,
    taskIdInput: number,
    toColumn?: string
  ) => void;
};

const TaskCategory = ({
  columnName,
  children,
  count,
  columns,
  addTask,
  changePhase,
}: TaskCategoryProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const toggleClose = () => {
    setShowAddModal((old) => !old);
  };
  const ref = useRef<HTMLDivElement>(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "Task",
    drop: (item: { id: number; fromColumn: string }) => {
      changePhase(item.fromColumn, item.id, columnName);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));
  drop(ref);
  return (
    <div
      ref={ref}
      className="w-80 border-2 border-gray-300 rounded-xl p-4 bg-gray-100 flex flex-col gap-4 justify-start max-h-150 relative"
    >
      {isOver && (
        <>
          <div className="absolute inset-10 bg-white/90 border-4 border-[var(--color-blue-500)] border-dashed z-[100]  rounded-xl"></div>
          <div className="absolute inset-0 bg-white/90 rounded-xl z-[99]"></div>
        </>
      )}
      <div className="flex justify-between">
        <p className="font-bold text-xl text-left pl-2">{columnName}</p>
        <p className="px-4 py-2 rounded-sm bg-white text-blue-500 flex items-center font-bold border-gray-300 border-2 leading-[1] ">
          {count}
        </p>
      </div>
      <div className="flex flex-col gap-2 grow">{children}</div>
      <div
        className="bg-sky-600 rounded-sm text-white font-semibold text-lg self-end px-4 py-1 cursor-pointer"
        onClick={toggleClose}
      >
        Add Card
      </div>
      {showAddModal && (
        <Modal
          mode="add"
          handleClose={toggleClose}
          columns={columns}
          addTask={addTask}
          defaultCategory={columnName}
        />
      )}
    </div>
  );
};

export default TaskCategory;
