// fieldComponents.js
// Reusable form field components for nodes

import React from "react";
import { FIELD_STYLES } from "./nodeConstants";

export const TextField = ({ label, value, onChange, placeholder = "" }) => (
    <div className="mt-2 mb-2">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 mb-1">
                {label}
            </label>
        )}
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
    </div>
);

export const TextAreaField = ({ label, value, onChange, rows = 3 }) => (
    <div className="mt-2 mb-2">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 mb-1">
                {label}
            </label>
        )}
        <textarea
            value={value}
            onChange={onChange}
            rows={rows}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-white font-mono focus:outline-none focus:ring-1 focus:ring-blue-300 resize-none"
        />
    </div>
);

export const SelectField = ({ label, value, onChange, options = [] }) => (
    <div className="mt-2 mb-2">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 mb-1">
                {label}
            </label>
        )}
        <select
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
        >
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

export const RadioGroup = ({ label, value, onChange, options = [] }) => (
    <div className="mt-2 mb-2">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 mb-1">
                {label}
            </label>
        )}
        <div className="mt-1">
            {options.map((opt) => (
                <div key={opt.value} className="mb-1">
                    <input
                        type="radio"
                        id={`radio-${opt.value}`}
                        name={label}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={onChange}
                        className="mr-1 cursor-pointer"
                    />
                    <label
                        htmlFor={`radio-${opt.value}`}
                        className="text-xs cursor-pointer"
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
    <div className="mt-2 mb-2">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 mb-1">
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
            className="w-full cursor-pointer mt-1"
        />
    </div>
);

export const FileInputField = ({ label, onChange }) => (
    <div className="mt-2 mb-2">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 mb-1">
                {label}
            </label>
        )}
        <input type="file" onChange={onChange} className="text-xs mt-1" />
    </div>
);

export const CheckboxField = ({ label, value, onChange }) => (
    <div className="mt-2 mb-2 flex items-center">
        <input
            type="checkbox"
            checked={value}
            onChange={onChange}
            className="mr-1 cursor-pointer"
        />
        {label && <label className="text-xs cursor-pointer">{label}</label>}
    </div>
);

export const NumberField = ({ label, value, onChange, min, max, step = 1 }) => (
    <div className="mt-2 mb-2">
        {label && (
            <label className="block text-xs font-semibold text-gray-700 mb-1">
                {label}
            </label>
        )}
        <input
            type="number"
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-300"
        />
    </div>
);

export const StatusBadge = ({ status, label = "" }) => {
    const colors = {
        idle: "bg-gray-400",
        running: "bg-green-500",
        error: "bg-red-500",
        success: "bg-blue-500",
    };

    return (
        <div
            className={`inline-block ${colors[status] || colors.idle} text-white px-2 py-1 rounded text-xs font-bold mt-2`}
        >
            {label || status.toUpperCase()}
        </div>
    );
};
