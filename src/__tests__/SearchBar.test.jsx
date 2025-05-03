import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "../components/SearchBar";
import { describe, test, expect, vi } from "vitest";

describe("SearchBar Component", () => {
  test("renders input with placeholder", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Search for a country...")).toBeInTheDocument();
  });

  test("displays input value", () => {
    render(<SearchBar value="India" onChange={() => {}} />);
    expect(screen.getByDisplayValue("India")).toBeInTheDocument();
  });

  test("calls onChange with new value", () => {
    const handleChange = vi.fn();
    render(<SearchBar value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("Search for a country...");
    fireEvent.change(input, { target: { value: "Japan" } });

    expect(handleChange).toHaveBeenCalledWith("Japan");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
