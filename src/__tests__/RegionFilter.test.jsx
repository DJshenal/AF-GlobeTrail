import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RegionFilter } from "../components/RegionFilter"; 
import { describe, test, expect, vi } from "vitest";

describe("RegionFilter Component", () => {
  test("renders dropdown with default option", () => {
    render(<RegionFilter selectedRegion="" onRegionChange={() => {}} />);
    expect(screen.getByDisplayValue("Filter by Region")).toBeInTheDocument();
  });

  test("renders all region options", () => {
    render(<RegionFilter selectedRegion="" onRegionChange={() => {}} />);
    const options = screen.getAllByRole("option");
    const expectedOptions = ["Filter by Region", "Africa", "Americas", "Asia", "Europe", "Oceania"];
    expect(options.map((opt) => opt.textContent)).toEqual(expectedOptions);
  });

  test("calls onRegionChange with selected value", () => {
    const handleChange = vi.fn();
    render(<RegionFilter selectedRegion="" onRegionChange={handleChange} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Asia" } });

    expect(handleChange).toHaveBeenCalledWith("Asia");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("shows selected region as selected", () => {
    render(<RegionFilter selectedRegion="Europe" onRegionChange={() => {}} />);
    expect(screen.getByDisplayValue("Europe")).toBeInTheDocument();
  });
});
