import React from "react";
import { render, screen } from "@testing-library/react";
import { CountryCard } from "../components/CountryCard";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("../hooks/useFavorites", () => ({
    useFavorites: () => ({
        isFavorite: () => false,
        toggleFavorite: vi.fn(),
    }),
}));

vi.mock("../contexts/AuthContext", () => ({
    useAuth: () => ({
        user: { email: "test@example.com" },
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
    }),
}));

const mockCountry = {
    cca3: "USA",
    flags: {
        svg: "https://flagcdn.com/us.svg",
        alt: "USA Flag",
    },
    name: {
        common: "United States",
        official: "United States of America",
    },
    capital: ["Washington, D.C."],
    population: 331000000,
    region: "Americas",
};

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("CountryCard Component", () => {
    test("renders country name, capital, population, and region", () => {
        renderWithRouter(<CountryCard country={mockCountry} />);

        expect(screen.getByText("United States")).toBeInTheDocument();
        expect(screen.getByText("United States of America")).toBeInTheDocument();
        expect(screen.getByText("Washington, D.C.")).toBeInTheDocument();
        expect(screen.getByText("331,000,000")).toBeInTheDocument();
        expect(screen.getByText("Americas")).toBeInTheDocument();
        expect(screen.getByAltText("USA Flag")).toBeInTheDocument();
    });

    test("handles missing optional fields gracefully", () => {
        const minimalCountry = {
            cca3: "XYZ",
            flags: {
                svg: "/xyz.svg",
            },
            name: {
                common: "Testland",
                official: "Republic of Testland",
            },
            population: 123456,
            region: "Test Region",
        };

        renderWithRouter(<CountryCard country={minimalCountry} />);

        expect(screen.getByText("Testland")).toBeInTheDocument();
        expect(screen.getByText("Republic of Testland")).toBeInTheDocument();
        expect(screen.getByText("123,456")).toBeInTheDocument();
        expect(screen.getByText("Test Region")).toBeInTheDocument();
        expect(screen.getByText("N/A")).toBeInTheDocument();
    });
});
