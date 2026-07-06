export const DULabelInput = ({id, label, defaultText, onChange = () => {}}) => {
    return (
        <label className="input">
            <span className="label">{label}</span>
            <input id={id} type="text" placeholder={defaultText} onChange={onChange} />
        </label>        
    )
}

export default DULabelInput;