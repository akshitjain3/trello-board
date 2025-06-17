import { useRef, useState, useEffect } from "react";
import type { Task } from "../App";
import useOutsideClick from "../assets/custom-hooks/useOutsideClick";
import Modal from "./CustomTrelloModal";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
type TaskItem = {
  task: Task;
  nextPhaseText: string;
  zIndex: number;
  moveToNextPhase: () => void;
  editTask: (
    id: number,
    title: string,
    desc: string,
    originalCategory: string,
    category: string
  ) => void;
  columns: string[];
  columnName: string;
};

const TaskItem = ({
  task,
  nextPhaseText,
  zIndex,
  moveToNextPhase,
  editTask,
  columns,
  columnName,
}: TaskItem) => {
  const [editDropdownOpen, setEditDropdownOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dropdownRef = useRef(null);
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "Task",
    item: {
      id: task.id,
      title: task.title,
      desc: task.desc,
      fromColumn: columnName,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));
  drag(ref);
  useOutsideClick(() => setEditDropdownOpen(false), dropdownRef);
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);
  return (
    <>
      <div
        className={`p-2 px-4 bg-white drop-shadow-sm rounded-lg flex justify-between`}
        style={{
          opacity: isDragging ? 0.5 : 1,
          cursor: "move",
          border: isDragging ? "2px dashed #999" : "",
          zIndex: zIndex,
        }}
        ref={ref}
      >
        <div className="gap-2">
          <p className="font-semibold text-xl text-left text-blue-500">
            {task.title}
          </p>
          <p className="font-medium text-sm text-left">{task.desc}</p>
        </div>
        <button
          className="flex items-center justify-center text-2xl font-bold -mt-[0.4em] cursor-pointer z-10 relative"
          onClick={() => setEditDropdownOpen((old) => !old)}
        >
          ...
          {editDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-[50%] left-0 -translate-x-[100%] transform drop-shadow-lg flex flex-col rounded-sm overflow-hidden w-30"
            >
              <p
                className="text-sm px-4 py-1 font-light bg-white hover:bg-gray-100 text-left"
                onClick={() => setShowEditModal(true)}
              >
                Edit
              </p>
              {nextPhaseText && (
                <p
                  className="text-sm px-4 py-1 font-light bg-white hover:bg-gray-100 text-left"
                  onClick={moveToNextPhase}
                >
                  {nextPhaseText}
                </p>
              )}
            </div>
          )}
        </button>
      </div>
      {showEditModal && (
        <Modal
          mode="edit"
          editTask={editTask}
          handleClose={() => setShowEditModal(false)}
          stringifiedTask={JSON.stringify({ ...task, category: columnName })}
          columns={columns}
        />
      )}
    </>
  );
};

export default TaskItem;
