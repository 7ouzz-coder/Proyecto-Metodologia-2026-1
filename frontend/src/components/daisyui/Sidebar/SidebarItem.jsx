export const SidebarItem = ({label, destination, icon}) => {
    return (
        <>
            <li>
                <a href={destination}>
                    <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" 
                        data-tip={label}
                    >
                        <div className="flex flex-row align-middle items-center-safe">
                        {icon()}
                        <span className="ml-1 is-drawer-close:hidden">{label}</span>
                        </div>
                    </button>
                </a>
            </li>
        </>
    );
}

export default SidebarItem;