/* eslint-disable react/prop-types */
export const Pagination = ({ total, limit, currentPage, onChange }) => {
    const totalPages = Math.ceil(total / limit);

    return <div className="paginationClass">

        <div>
            <button
                onClick={() => onChange(currentPage - 1)}
                disabled={currentPage === 1}
            >Previous</button>

            <button
                onClick={() => onChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >Next</button>
        </div>

        <span>Page {currentPage} of {totalPages}</span>
    </div>
}