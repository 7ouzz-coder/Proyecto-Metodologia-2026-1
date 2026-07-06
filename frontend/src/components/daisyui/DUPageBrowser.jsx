export const DUPageBrowser = ({currentPageNumber, setCurrentPageNumber, pageAmount}) => {
    const NumberParser = (number) => {
        if (isNaN(number)) {
            return 1;
        }
        return Number(number);
    } 

    const pageNumberDecreaser = (a, b) => {
        if ((a = (a - 1)) <= 0) {
            return b;
        }
        return a;
    }


    return (
        <div className="join m-3 mt-0">
            <button className="join-item btn" onClick={() => setCurrentPageNumber(pageNumberDecreaser(currentPageNumber, pageAmount))}>«</button>
            <button className="join-item btn">Página {NumberParser(currentPageNumber)}</button>
            <button className="join-item btn" onClick={() => setCurrentPageNumber(Math.abs(Math.ceil(currentPageNumber % (pageAmount)) + 1))}>»</button>
        </div>
    );
}