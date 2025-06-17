import { useCallback, useState } from "react";
import "./App.css";
import TaskCategory from "./components/TaskCategory";
import TaskItem from "./components/TaskItem";
import AddCategory from "./components/AddCategory";

export type Column = {
  id: number;
  title: string;
  taskIds: number[];
  nextPhaseText: string;
};

export type Category = {
  id: number;
  title: string;
};

export type Task = {
  id: number;
  title: string;
  desc: string;
};

export type TaskType = {
  columns: { [columnName: string]: Column };
  columnsOrder: string[];
  tasks: { [taskId: number]: Task };
};

const data: TaskType = {
  columns: {
    Todo: {
      id: 1,
      title: "Todo",
      taskIds: [1, 4, 5],
      nextPhaseText: "Start task",
    },
    "In Progress": {
      id: 2,
      title: "In Progress",
      taskIds: [2, 3, 8],
      nextPhaseText: "Mark as complete",
    },
    Completed: {
      id: 3,
      title: "Completed",
      taskIds: [6, 7, 9],
      nextPhaseText: "Remove",
    },
  },
  columnsOrder: ["Todo", "In Progress", "Completed"],
  tasks: {
    1: {
      id: 1,
      title: "Task1",
      desc: "Desc1",
    },
    2: {
      id: 2,
      title: "Task2",
      desc: "Desc2",
    },
    3: {
      id: 3,
      title: "Task3",
      desc: "Desc3",
    },
    4: {
      id: 4,
      title: "Task4",
      desc: "Desc4",
    },
    5: {
      id: 5,
      title: "Task5",
      desc: "Desc5",
    },
    6: {
      id: 6,
      title: "Task6",
      desc: "Desc6",
    },
    7: {
      id: 7,
      title: "Task7",
      desc: "Desc7",
    },
    8: {
      id: 8,
      title: "Task8",
      desc: "Desc8",
    },
    9: {
      id: 9,
      title: "Task9",
      desc: "Desc9",
    },
  },
};

function App() {
  const [tasks, setTasks] = useState<TaskType>(data);
  const getNextPhase = useCallback(
    (columnName: string) => {
      const currIndex = tasks.columnsOrder.indexOf(columnName);
      if (currIndex === -1 || currIndex >= tasks.columnsOrder.length - 1)
        return null;
      else return tasks.columnsOrder[currIndex + 1];
    },
    [tasks.columnsOrder]
  );

  const changePhase = useCallback(
    (fromColumn: string, taskIdInput: number, toColumn?: string) => {
      const updateColumn = toColumn ?? getNextPhase(fromColumn);
      setTasks((prev) => {
        let updatedColumns = {
          ...prev.columns,
          [fromColumn]: {
            ...prev.columns[fromColumn],
            taskIds: prev.columns[fromColumn].taskIds.filter(
              (taskId) => taskId !== taskIdInput
            ),
          },
        };
        if (updateColumn) {
          updatedColumns = {
            ...updatedColumns,
            [updateColumn]: {
              ...updatedColumns[updateColumn],
              taskIds: updatedColumns[updateColumn].taskIds.concat([
                taskIdInput,
              ]),
            },
          };
        }
        return {
          ...prev,
          columns: updatedColumns,
        };
      });
    },
    [getNextPhase]
  );

  const addTask = useCallback(
    (id: number, title: string, desc: string, category: string) => {
      setTasks((prev) => {
        const columnsModified = { ...prev.columns };
        columnsModified[category] = {
          ...prev.columns[category],
          taskIds: prev.columns[category].taskIds.concat([id]),
        };
        const tasksModified = { ...prev.tasks };
        tasksModified[id] = {
          id: id,
          title: title,
          desc: desc,
        };
        return {
          columnsOrder: [...prev.columnsOrder],
          columns: columnsModified,
          tasks: tasksModified,
        };
      });
    },
    []
  );

  const editTask = useCallback(
    (
      id: number,
      title: string,
      desc: string,
      originalCategory: string,
      category: string
    ) => {
      setTasks((prev) => {
        const updatedTasks = { ...prev.tasks, [id]: { id, title, desc } };
        if (originalCategory !== category) {
          const updatedColumns = { ...prev.columns };
          updatedColumns[originalCategory] = {
            ...updatedColumns[originalCategory],
            taskIds: updatedColumns[originalCategory].taskIds.filter(
              (taskId) => taskId !== id
            ),
          };
          updatedColumns[category] = {
            ...updatedColumns[category],
            taskIds: updatedColumns[category].taskIds.concat([id]),
          };
          return { ...prev, tasks: updatedTasks, columns: updatedColumns };
        } else {
          return { ...prev, tasks: updatedTasks };
        }
      });
    },
    []
  );
  const handleAddCategory = useCallback(
    (
      newCat: string,
      nextPhase: string,
      position: number,
      nextPhaseTextPrevCat: string
    ) => {
      setTasks((prev) => {
        const columnsOrder = [...prev.columnsOrder];
        const prevColumn = position === 0 ? null : columnsOrder[position - 1];
        columnsOrder.splice(position, 0, newCat);
        const id = Date.now();
        let columns = {
          ...prev.columns,
          [newCat]: {
            id,
            title: newCat,
            nextPhaseText: nextPhase,
            taskIds: [],
          },
        };
        if (prevColumn)
          columns = {
            ...columns,
            [prevColumn]: {
              ...columns[prevColumn],
              nextPhaseText: nextPhaseTextPrevCat,
            },
          };
        return { ...prev, columnsOrder, columns };
      });
    },
    []
  );
  return (
    <div className="flex flex-col grow bg-sky-200 rounded-xl p-6 gap-6 w-full max-w-full">
      <div className="flex gap-5 justify-start">
        <p className="pl-4 text-left text-2xl font-bold">
          Marketing Campaign Project
        </p>
        <AddCategory
          handleAddCategory={handleAddCategory}
          columns={tasks.columnsOrder}
        />
      </div>
      <div className="flex flex-wrap w-full max-w-full gap-4 justify-start">
        {tasks.columnsOrder.map((columnName) => {
          return (
            <TaskCategory
              key={tasks.columns[columnName].id}
              columnName={columnName}
              count={tasks.columns[columnName].taskIds.length}
              columns={tasks.columnsOrder}
              addTask={addTask}
              editTask={editTask}
              changePhase={changePhase}
            >
              {tasks.columns[columnName].taskIds.map((taskId, index) => (
                <TaskItem
                  key={tasks.tasks[taskId].id}
                  task={tasks.tasks[taskId]}
                  nextPhaseText={tasks.columns[columnName].nextPhaseText}
                  moveToNextPhase={() => {
                    changePhase(columnName, taskId);
                  }}
                  zIndex={tasks.columns[columnName].taskIds.length - index}
                  editTask={editTask}
                  columns={tasks.columnsOrder}
                  columnName={columnName}
                />
              ))}
            </TaskCategory>
          );
        })}
      </div>
    </div>
  );
}

export default App;
