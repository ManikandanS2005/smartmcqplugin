"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useMCQ } from "@/context/MCQContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const EditPage = () => {
  const router = useRouter();
  const { generatedMCQs, updateMCQ } = useMCQ();

  const handleVerify = () => {
    let hasEmpty = false;

    for (let mcq of generatedMCQs) {
      if (!mcq.question?.trim() || !mcq.answer?.trim()) {
        hasEmpty = true;
        break;
      }
      if (mcq.options.some((opt) => !opt?.trim())) {
        hasEmpty = true;
        break;
      }
    }

    if (hasEmpty) {
      toast.error(
        "You cannot leave an empty element. If you want to modify the basic structure, modify it in Basic Info Backwards."
      );
      return;
    }

    router.push("/formDetails");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Edit MCQs</h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {generatedMCQs.map((q, i) => (
          <div
            key={i}
            className="border p-4 rounded shadow space-y-4 bg-black hover:scale-105 transition-transform duration-200"
          >
            {/* Question */}
            <div className="flex items-center space-x-1.5">
              <div className="w-5 font-bold text-gray-300 select-none cursor-default">
                {i + 1}.
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Input
                    value={q.question}
                    onChange={(e) =>
                      updateMCQ(i, { ...q, question: e.target.value })
                    }
                    placeholder={`Question ${i + 1}`}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 flex-1 rounded-md px-3 py-2"
                  />
                </TooltipTrigger>
                <TooltipContent>Question</TooltipContent>
              </Tooltip>
            </div>

            {/* Options */}
            {q.options.map((opt, j) => {
              const optionLabel = String.fromCharCode(65 + j);
              return (
                <div key={j} className="flex items-center space-x-1.5">
                  <div className="w-5 font-semibold text-gray-400 select-none cursor-default">
                    {optionLabel}
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const updatedOptions = [...q.options];
                          updatedOptions[j] = e.target.value;
                          updateMCQ(i, { ...q, options: updatedOptions });
                        }}
                        placeholder={`Option ${optionLabel}`}
                        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-gray-800 flex-1 rounded-md px-3 py-2"
                      />
                    </TooltipTrigger>
                    <TooltipContent>{`Option ${optionLabel}`}</TooltipContent>
                  </Tooltip>
                </div>
              );
            })}

            {/* Answer */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Input
                  value={q.answer}
                  onChange={(e) => updateMCQ(i, { ...q, answer: e.target.value })}
                  placeholder="Answer"
                  className="text-green-500  focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-green-900 rounded-md px-3 py-2"
                />
              </TooltipTrigger>
              <TooltipContent>Answer</TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-5">
        <Button
          onClick={() => router.back()}
          className="mt-4 w-fit h-10 bg-blue-800 cursor-pointer hover:scale-125"
        >
          Back
        </Button>
        <Button
          onClick={handleVerify}
          className="mt-4 w-fit h-10 bg-blue-800 cursor-pointer hover:scale-125"
        >
          Verified
        </Button>
      </div>
    </div>
  );
};

export default EditPage;
