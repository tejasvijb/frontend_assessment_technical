// fieldComponents.js
// Reusable form field components for nodes

import React from "react";
import { FIELD_STYLES } from "./nodeConstants";

export const TextField = ({ label, value, onChange, placeholder = "" }) => (
    <div style={{ marginTop: "4px", marginBottom: "4px" }}>
        {label && <label style={FIELD_STYLES.label}>{label}</label>}
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            style={FIELD_STYLES.input}
        />
    </div>
);

export const TextAreaField = ({ label, value, onChange, rows = 3 }) => (
    <div style={{ marginTop: "4px", marginBottom: "4px" }}>
        {label && <label style={FIELD_STYLES.label}>{label}</label>}
        <textarea
            value={value}
            onChange={onChange}
            rows={rows}
            style={{
                ...FIELD_STYLES.input,
                fontFamily: "monospace",
                resize: "none",
            }}
        />
    </div>
);

export const SelectField = ({ label, value, onChange, options = [] }) => (
    <div style={{ marginTop: "4px", marginBottom: "4px" }}>
        {label && <label style={FIELD_STYLES.label}>{label}</label>}
        <select value={value} onChange={onChange} style={FIELD_STYLES.select}>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

export const RadioGroup = ({ label, value, onChange, options = [] }) => (
    <div style={{ marginTop: "4px", marginBottom: "4px" }}>
        {label && <label style={FIELD_STYLES.label}>{label}</label>}
        <div style={{ marginTop: "2px" }}>
            {options.map((opt) => (
                <div key={opt.value} style={{ marginBottom: "2px" }}>
                    <input
                        type="radio"
                        id={`radio-${opt.value}`}
                        name={label}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={onChange}
                        style={{ marginRight: "4px", cursor: "pointer" }}
                    />
                    <label
                        htmlFor={`radio-${opt.value}`}
                        style={{ fontSize: "11px", cursor: "pointer" }}
                    >
                        {opt.label}
                    </label>
                </div>
            ))}
        </div>
    </div>
);

export const SliderField = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
}) => (
    <div style={{ marginTop: "4px", marginBottom: "4px" }}>
        {label && (
            <label style={FIELD_STYLES.label}>
                {label}: {value}
            </label>
        )}
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            style={{ width: "100%", cursor: "pointer", marginTop: "2px" }}
        />
    </div>
);

export const FileInputField = ({ label, onChange }) => (
    <div style={{ marginTop: "4px", marginBottom: "4px" }}>
        {label && <label style={FIELD_STYLES.label}>{label}</label>}
        <input
            type="file"
            onChange={onChange}
            style={{ fontSize: "10px", marginTop: "2px" }}
        />
    </div>
);

export const CheckboxField = ({ label, value, onChange }) => (
    <div
        style={{
            marginTop: "4px",
            marginBottom: "4px",
            display: "flex",
            alignItems: "center",
        }}
    >
        <input
            type="checkbox"
            checked={value}
            onChange={onChange}
            style={{ marginRight: "4px", cursor: "pointer" }}
        />
        {label && (
            <label style={{ fontSize: "11px", cursor: "pointer" }}>
                {label}
            </label>
        )}
    </div>
);

export const NumberField = ({ label, value, onChange, min, max, step = 1 }) => (
    <div style={{ marginTop: "4px", marginBottom: "4px" }}>
        {label && <label style={FIELD_STYLES.label}>{label}</label>}
        <input
            type="number"
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            style={FIELD_STYLES.input}
        />
    </div>
);

export const StatusBadge = ({ status, label = "" }) => {
    const colors = {
        idle: "#999",
        running: "#4CAF50",
        error: "#f44336",
        success: "#2196F3",
    };

    return (
        <div
            style={{
                display: "inline-block",
                backgroundColor: colors[status] || colors.idle,
                color: "white",
                padding: "2px 6px",
                borderRadius: "3px",
                fontSize: "10px",
                fontWeight: "bold",
                marginTop: "4px",
            }}
        >
            {label || status.toUpperCase()}
        </div>
    );
};
