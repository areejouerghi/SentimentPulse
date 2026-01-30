type Props = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
};

export function Pagination({ currentPage, totalPages, onPageChange }: Props) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center items-center gap-2 mt-4">
            <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                ← Précédent
            </button>

            <div className="flex gap-1">
                {pages.map(page => (
                    // Simple logic for small number of pages. 
                    // For large numbers, we'd need ellipsis logic, but for MVP this is fine.
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={currentPage === page}
                        className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ minWidth: '32px' }}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Suivant →
            </button>
        </div>
    );
}
