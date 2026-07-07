export const DUPageBrowser = ({ currentPageNumber, setCurrentPageNumber, pageAmount }) => {
    const NumberParser = (number) => {
        if (isNaN(number)) return 1;
        return Number(number);
    };

    const pageNumberDecreaser = (a, b) => {
        if ((a = a - 1) <= 0) return b;
        return a;
    };

    const currentParsed = NumberParser(currentPageNumber);
    const totalPages = NumberParser(pageAmount);

    return (
        <div className="flex items-center gap-2">
            <button
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setCurrentPageNumber(pageNumberDecreaser(currentParsed, totalPages))}
                disabled={currentParsed <= 1}
                aria-label="Página anterior"
            >
                ‹
            </button>

            <div className="px-4 h-9 flex items-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-600/30">
                {currentParsed} <span className="mx-1.5 text-indigo-300">/</span> {totalPages}
            </div>

            <button
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                onClick={() => setCurrentPageNumber(Math.abs(Math.ceil(currentParsed % totalPages) + 1))}
                disabled={currentParsed >= totalPages}
                aria-label="Página siguiente"
            >
                ›
            </button>
        </div>
    );
};