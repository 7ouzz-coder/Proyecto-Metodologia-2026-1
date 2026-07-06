/*
<button className="btn btn-neutral">Neutral</button>
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-accent">Accent</button>
<button className="btn btn-info">Info</button>
<button className="btn btn-success">Success</button>
<button className="btn btn-warning">Warning</button>
<button className="btn btn-error">Error</button>
*/

export const getButtonColor = (color) => {
    switch (color) {
        case "primary":
            return "btn-primary";
        case "secondary":
            return "btn-secondary";
        case "accent":
            return "btn-accent";
        case "info":
            return "btn-info";
        case "success":
            return "btn-success";
        case "warning":
            return "btn-warning";
        case "error":
            return "btn-error";
        case "default":
        case "neutral":
            return "btn-neutral";
        default:
            console.error(`Botón desconocido: ${String(color)}`);
            return "btn-neutral";
    }
}