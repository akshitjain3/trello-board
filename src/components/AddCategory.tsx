import { useRef, useState } from "react";
type AddCategoryModalProps = {
  handleClose: () => void;
  columns: string[];
  handleAddCategory: (
    newCat: string,
    nextPhase: string,
    position: number,
    nextPhaseTextPrevCat: string
  ) => void;
};

const AddCategoryModal = ({
  handleClose,
  columns,
  handleAddCategory,
}: AddCategoryModalProps) => {
  const modalRef = useRef(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formdata.entries());
    handleAddCategory(
      formValues.category as string,
      formValues.npt as string,
      Number(formValues.position) as number,
      formValues.ppt as string
    );
    handleClose();
  };
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
            Add new category
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Category Name"
              className="px-2 py-2 border-2 border-[#CCC] rounded-lg"
              name="category"
              required
            />
            <input
              placeholder="Next Phase text"
              className="px-2 py-2 border-2 border-[#CCC] rounded-lg"
              name="npt"
            />
            <label
              className="text-left pl-2 font-semibold text-lg"
              htmlFor="catPos"
            >
              Position Category After
            </label>
            <select
              id="catPos"
              name="position"
              className="p-2 bg-white border-2 border-[#CCC] rounded-lg cursor-pointer"
            >
              {columns.map((column, index) => (
                <option
                  key={column}
                  value={index + 1}
                  className="cursor-pointer"
                >
                  {column}
                </option>
              ))}
              <option value={0} className="cursor-pointer">
                Before All
              </option>
            </select>
            <input
              placeholder="Previous Phase text"
              className="px-2 py-2 border-2 border-[#CCC] rounded-lg"
              name="ppt"
            />
            <div className="flex justify-between">
              <button
                type="reset"
                className="bg-white rounded-sm text-sky-600 tracking-wide font-semibold text-lg self-end px-4 py-1 cursor-pointer hover:bg-gray-200 hover:outline-2 hover:outline-gray-400"
              >
                Clear
              </button>
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
const AddCategory = ({
  handleAddCategory,
  columns,
}: {
  handleAddCategory: (
    newCat: string,
    nextPhase: string,
    position: number,
    nextPhaseTextPrevCat: string
  ) => void;
  columns: string[];
}) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className="bg-sky-600 rounded-sm text-white font-semibold text-xl px-4 py-2 leading-none cursor-pointer flex items-center justify-center"
        onClick={() => setShowModal(true)}
      >
        Add Category
      </div>
      {showModal && (
        <AddCategoryModal
          handleClose={() => setShowModal(false)}
          columns={columns}
          handleAddCategory={handleAddCategory}
        />
      )}
    </>
  );
};

export default AddCategory;
