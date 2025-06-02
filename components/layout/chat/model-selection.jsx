"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useModels } from "@/hooks/useModels"

export function ChatGPTModelSelection() {
    const { models, loading, error, selectedModel, setSelectedModel } = useModels();

    if (loading) return <p>Loading models...</p>;
    if (error) return <p>Error loading models: {error}</p>;
    // console.log("model-selection", selectedModel)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{selectedModel}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
                <DropdownMenuLabel>Select a models</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={selectedModel} onValueChange={setSelectedModel}>
                    {models.map((model) => (
                        <DropdownMenuRadioItem value={model.id}>{model.id}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
