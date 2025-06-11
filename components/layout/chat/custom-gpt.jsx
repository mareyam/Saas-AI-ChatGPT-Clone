'use client'

import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomFormTextArea } from "@/components/ui/textarea";
import { CustomFormInput, CustomFormSlider } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";


const CustomGPT = ({ open, onClose }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        instructions: "",
        conversationStarters: "",
        profilePic: "",
        capabilities: {
            webSearch: true,
            canvas: true,
            imageGen: true,
            codeInterpreter: false,
        },
        model: "gpt-4",
        messages: "",
        temperature: 0.7,
        top_p: 1,
        max_tokens: 2048,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (key) => {
        setFormData(prev => ({
            ...prev,
            capabilities: {
                ...prev.capabilities,
                [key]: !prev.capabilities[key],
            },
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, profilePic: url }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("here")
        console.log("formData");
    };

    const handleSliderChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value[0] }));
    };

    const handleCreateCustomGPT = async (e) => {
        e.preventDefault();
        const {
            name, description, instructions, conversationStarters, capabilities,
            messages,
            model,
            temperature,
            top_p,
            max_tokens,
            frequency_penalty,
            presence_penalty,
            stop,
        } = formData;

        if (!messages.trim()) return;
        const prompt = messages;

        setLoading(true);

        try {
            const res = await fetch('/api/customGPT', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name, 
                    description, 
                    instructions,
                    conversationStarters, 
                    capabilities,
                    prompt,
                    model,
                    temperature,
                    top_p,
                    max_tokens,
                    frequency_penalty,
                    presence_penalty,
                    stop,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong');
            console.log('GPT response:', data.result);

        } catch (error) {
            console.error('Error calling custom GPT:', error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{step === 1 ? "Configure your GPT" : "Configure GPT Parameters"}</DialogTitle>
                </DialogHeader>

                {step === 1 ? (

                    <form className="space-y-5 mt-4 w-full overflow-y-auto">
                        <div className="flex justify-center">
                            <label
                                htmlFor="profilePicUpload"
                                className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-full cursor-pointer hover:border-primary transition-colors select-none"
                                aria-label="Upload profile picture"
                            >
                                {formData?.profilePic ? (
                                    <Image
                                        src={formData?.profilePic}
                                        alt="Profile Preview"
                                        width={96}
                                        height={96}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <span className="text-xl text-muted-foreground">+</span>
                                )}
                            </label>
                            <input
                                id="profilePicUpload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        <CustomFormInput
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Name your GPT"
                        />

                        <CustomFormInput
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Short description about what this GPT does"
                        />

                        <CustomFormTextArea
                            label="Instructions"
                            name="instructions"
                            value={formData.instructions}
                            onChange={handleInputChange}
                            placeholder="What does this GPT do? How does it behave? What should it avoid doing?"
                        />

                        <CustomFormInput
                            label="Conversation Starters"
                            name="conversationStarters"
                            value={formData.conversationStarters}
                            onChange={handleInputChange}
                            placeholder="e.g. How can I improve my resume?"
                        />

                        <div>
                            <Label>Capabilities</Label>
                            <div className="space-y-2 mt-2">
                                {[
                                    ["webSearch", "Web Search"],
                                    ["canvas", "Canvas"],
                                    ["imageGen", "4o Image Generation"],
                                    ["codeInterpreter", "Code Interpreter & Data Analysis"],
                                ].map(([key, label]) => (
                                    <div key={key} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={key}
                                            checked={formData.capabilities[key]}
                                            onCheckedChange={() => handleCheckboxChange(key)}
                                        />
                                        <Label htmlFor={key}>{label}</Label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="button" onClick={() => setStep(2)}>
                                Next
                            </Button>
                        </div>
                    </form>

                ) : (
                    <>
                        <form onSubmit={handleCreateCustomGPT}>
                            <div className="space-y-6 mt-4 overflow-y-auto">
                                <CustomFormInput
                                    label="Model"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    placeholder="e.g. gpt-4, gpt-4o"
                                />

                                <CustomFormInput
                                    label="Max Tokens"
                                    name="max_tokens"
                                    value={formData.max_tokens}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 2048"
                                />

                                <CustomFormTextArea
                                    label="Messages (JSON)"
                                    name="messages"
                                    value={formData.messages}
                                    onChange={handleInputChange}
                                    placeholder='[{"role": "user", "content": "Hi"}]'
                                />

                                <CustomFormSlider
                                    label="Temperature"
                                    name="temperature"
                                    value={formData.temperature}
                                    onChange={handleSliderChange}
                                    min={0}
                                    max={2}
                                    step={0.1}
                                />

                                <CustomFormSlider
                                    label="Top P"
                                    name="top_p"
                                    value={formData.top_p}
                                    onChange={handleSliderChange}
                                    min={0}
                                    max={1}
                                    step={0.1}
                                />

                                <CustomFormSlider
                                    label="Frequency Penalty"
                                    name="frequency_penalty"
                                    value={formData.frequency_penalty}
                                    onChange={handleSliderChange}
                                    min={-2}
                                    max={2}
                                    step={0.1}
                                />

                                <CustomFormSlider
                                    label="Presence Penalty"
                                    name="presence_penalty"
                                    value={formData.presence_penalty}
                                    onChange={handleSliderChange}
                                    min={-2}
                                    max={2}
                                    step={0.1}
                                />

                                <CustomFormInput
                                    label="Stop (comma separated)"
                                    name="stop"
                                    value={formData.stop}
                                    onChange={handleInputChange}
                                    placeholder="e.g. stop1,stop2"
                                />
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                                    Back
                                </Button>
                                <Button type="submit">Run</Button>
                            </div>
                        </form>


                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default CustomGPT;
