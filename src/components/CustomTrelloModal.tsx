import { useRef } from "react";
import useOutsideClick from "./custom-hooks/useOutsideClick";
import type { Task } from "../App";

type ModifiedTask = Task & {
  category: string;
};

type ModalProps =
  | {
      handleClose: () => void;
      columns: string[];
      addTask: (
        id: number,
        title: string,
        desc: string,
        category: string
      ) => void;
      mode: "add";
      defaultCategory: string;
    }
  | {
      handleClose: () => void;
      columns: string[];
      stringifiedTask: string;
      editTask: (
        id: number,
        title: string,
        desc: string,
        originalCategory: string,
        category: string
      ) => void;
      mode: "edit";
    };
const Modal = (props: ModalProps) => {
  const modalRef = useRef(null);
  const { mode, handleClose, columns } = props;
  useOutsideClick(handleClose, modalRef);
  const task: ModifiedTask | null =
    mode === "edit" ? JSON.parse(props.stringifiedTask) : null;
  const defaultCategory =
    mode === "add"
      ? props.defaultCategory
      : JSON.parse(props.stringifiedTask).category;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    if (mode === "add") {
      const id = Date.now();
      props.addTask(
        id,
        formValues.title as string,
        formValues.desc as string,
        formValues.category as string
      );
    } else {
      props.editTask(
        task?.id || Date.now(),
        formValues.title as string,
        formValues.desc as string,
        (task?.category as string) || "Todo",
        formValues.category as string
      );
    }
    handleClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] z-[1000]">
      <div
        ref={modalRef}
        className="rounded-xl overflow-hidden relative bg-gray-100"
      >
        <button
          className="absolute top-4 right-4 rounded-sm flex items-center justify-center leading-[1] border-2 border-[#CCC] py-2 px-3 text-xl cursor-pointer hover:outline-2 hover:outline-gray-600"
          onClick={handleClose}
        >
          X
        </button>
        <div className="w-100 flex flex-col p-6 gap-4">
          <p className="text-2xl font-bold text-sky-600 text-left pl-2">
            {mode === "add" ? "Add Card" : "Edit Card"}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              defaultValue={task ? task.title : ""}
              className="px-2 py-2 border-2 border-[#CCC] rounded-lg"
              name="title"
              required
            />
            <textarea
              maxLength={100}
              placeholder="Description"
              defaultValue={task ? task.desc : ""}
              className="px-2 py-2 border-2 border-[#CCC] rounded-lg"
              name="desc"
              required
            />
            <label
              className="text-left pl-2 font-semibold text-lg"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              className="p-2 bg-white border-2 border-[#CCC] rounded-lg cursor-pointer"
              defaultValue={defaultCategory}
            >
              {columns.map((column) => (
                <option key={column} value={column} className="cursor-pointer">
                  {column}
                </option>
              ))}
            </select>
            <div className="flex justify-between">
              {mode === "add" && (
                <button
                  type="reset"
                  className="bg-white rounded-sm text-sky-600 tracking-wide font-semibold text-lg self-end px-4 py-1 cursor-pointer hover:bg-gray-200 hover:outline-2 hover:outline-gray-400"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="bg-sky-600 rounded-sm text-white font-semibold text-lg self-end px-4 py-1 cursor-pointer hover:bg-sky-500 hover:outline-2 hover:outline-gray-400"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;
