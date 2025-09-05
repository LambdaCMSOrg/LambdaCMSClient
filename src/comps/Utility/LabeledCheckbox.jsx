export function LabeledCheckbox({ label, checked, onChange }) {
    return (
        <label  className="text-[var(--color-textH2)]">
            <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
            {' ' + label}
        </label>
    );
}