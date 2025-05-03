import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavoriteButton } from "../components/FavoriteButton";
import { describe, test, expect, vi } from "vitest";

vi.mock("react-hot-toast", () => ({
    default: {
        error: vi.fn(),
    },
    error: vi.fn(),
}));

vi.mock("../contexts/AuthContext", () => ({
    useAuth: vi.fn(),
}));

import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

describe("FavoriteButton Component", () => {
    test("calls onToggle if user is signed in", () => {
        const onToggleMock = vi.fn();
        useAuth.mockReturnValue({ user: { id: "123" } });

        render(
            <FavoriteButton countryCode="USA" isFavorite={false} onToggle={onToggleMock} />
        );

        const button = screen.getByRole("button", { name: /add to favorites/i });
        fireEvent.click(button);

        expect(onToggleMock).toHaveBeenCalledTimes(1);
        expect(toast.error).not.toHaveBeenCalled();
    });

    test("shows error toast if user is not signed in", () => {
        const onToggleMock = vi.fn();
        useAuth.mockReturnValue({ user: null });

        render(
            <FavoriteButton countryCode="USA" isFavorite={false} onToggle={onToggleMock} />
        );

        const button = screen.getByRole("button", { name: /add to favorites/i });
        fireEvent.click(button);

        expect(onToggleMock).not.toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith("Please sign in to add favorites");
    });

    test("renders filled heart when isFavorite is true", () => {
        useAuth.mockReturnValue({ user: { id: "123" } });

        render(
            <FavoriteButton countryCode="USA" isFavorite={true} onToggle={() => { }} />
        );

        const button = screen.getByRole("button", { name: /remove from favorites/i });
        expect(button).toBeInTheDocument();
    });

    test("renders unfilled heart when isFavorite is false", () => {
        useAuth.mockReturnValue({ user: { id: "123" } });

        render(
            <FavoriteButton countryCode="USA" isFavorite={false} onToggle={() => { }} />
        );

        const button = screen.getByRole("button", { name: /add to favorites/i });
        expect(button).toBeInTheDocument();
    });
});
