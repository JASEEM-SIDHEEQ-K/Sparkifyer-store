import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentPage,
  selectTotalPages,
  selectFilteredCount,
  selectItemsPerPage,
  setCurrentPage,
} from "../../features/products/productSlice";

const Pagination = () => {
  const dispatch = useDispatch();
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const filteredCount = useSelector(selectFilteredCount);
  const itemsPerPage = useSelector(selectItemsPerPage);


  // ─── Don't render if only 1 page ──────────────────────
  if (filteredCount === 0) return null;

  // ─── Page range start/end ─────────────────────────────
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredCount);

  // ─── Generate page numbers ────────────────────────────
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      // show all pages if 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // show pages around current
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // ─── Handlers ─────────────────────────────────────────
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    dispatch(setCurrentPage(page));
    //scroll to top on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-8">

      {/* ── Items count ───────────────────────────────── */}
      <p className="text-xs text-slate-400">
        Showing{" "}
        <span className="font-semibold text-slate-600">
          {startItem}
        </span>{" "}
        to{" "}
        <span className="font-semibold text-slate-600">
          {endItem}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-600">
          {filteredCount}
        </span>{" "}
        products
      </p>

      {/* ── Pagination Controls ───────────────────────── */}
      <div className="flex items-center gap-1">

        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          ‹
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => (
          page === "..." ? (
            <span
              key={`dots-${index}`}
              className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition
                ${currentPage === page
                  ? "bg-blue-600 text-white border border-blue-600"
                  : "border border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600"
                }`}
            >
              {page}
            </button>
          )
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-300 text-slate-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm"
        >
          ›
        </button>

      </div>

    </div>
  );
};

export default Pagination;